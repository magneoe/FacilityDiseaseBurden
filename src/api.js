/**
 * Created by Magnus on 12.05.2017.
 */

const serverUrl = 'http://localhost:8082/api';
var userName;
var passWord;


/**
 * Default options object to send along with each request
 */
var fetchOptions = {
    method: 'GET',
    headers: {
        Authorization: '',
        'Content-Type': 'application/json',
    }
};

/**
 * `fetch` will not reject the promise on the a http request that is not 2xx, as those requests could also return valid responses.
 * We will only treat status codes in the 200 range as successful and reject the other responses.
 */
function setCredentials(username, password){
    userName = username;
    passWord = password;

    fetchOptions.headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
    console.log(fetchOptions);
}

function requestCredentials() {
    var username;
    var password;
    if((username = prompt("Username:")) == null) {return false;}
    if((password = prompt("Password:")) == null) {return false;}

    setCredentials(username, password);
    return true;
}

function onlySuccessResponses(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    }
    return Promise.reject(response);
}

/*
 DHIS2 Functions, CRUD
 */
function fetchDataFromDHIS2(query){
    console.log(query, fetchOptions.headers.Authorization);
    return fetch(`${serverUrl}/${query}`, fetchOptions).
        then(onlySuccessResponses)
            .then(response => response.json());
}
function createIntoDHIS2(unit, query) {
    // POST the payload to the server to save the unit
    return fetch(`${serverUrl}/${query}`, Object.assign({}, fetchOptions, { method: 'POST', body: JSON.stringify(unit) }))
            .then(onlySuccessResponses)
            .then(response => {
            return response.json();
}, function(response){

        return response;
    }).catch(error => console.error(error));
}
function updateIntoDHIS2(unit, query) {
    // PUT the payload to the server to save the unit
    return fetch(`${serverUrl}/${query}`, Object.assign({}, fetchOptions, { method: 'PUT', body: JSON.stringify(unit) }))
            .then(onlySuccessResponses)
            // Parse the json response
            .then(response => response.json())
    // Log any errors to the console. (Should probably do some better error handling);
.catch(error => console.error(error));
}

function deleteDataFromDHIS2(query, data){
    console.log('Delete query:', query, data);
    return fetch(`${serverUrl}/${query}`, {headers: fetchOptions.headers, method: 'DELETE'}).then(onlySuccessResponses)
            .catch(error => console.error(error));
}
