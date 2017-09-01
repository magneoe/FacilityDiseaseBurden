/**
 * Created by Magnus on 12.05.2017.
 */


var loadOrgChooser=()=> {
    while(!requestCredentials()) {alert("Unable to log inn")}

    alert("Logged in");

    var oElement=(val, txt)=>{
        var o = document.createElement("option");
        o.setAttribute("value", val);
        o.innerText = txt;
        return o;
    };
    var sList=(val) => {
        var s = document.createElement("select");
        s.setAttribute("id", val);
        s.addEventListener("change", changeOrgUnit);
        return s;
    }

    var setSelectTitle=(s, t)=>{
        s.appendChild(oElement(title, t));
    };

    var addLevel = (ancestorId, level)=> {
        loader.setAttribute("class", "loader");
        populateChildren(ancestorId, level);
    }
    var addOptions =(levelId, orgUnits)=>{
        console.log('orgUnits add options', orgUnits);
        for(var i = 0; i < orgUnits.length; i++){
            levelId.appendChild(oElement(orgUnits[i].id, orgUnits[i].displayName));
        }
    }

    var populateChildren = (ancestorId, level) => {
        var query = '';
        if(ancestorId == null)
            query = `organisationUnits?level=1&paging=0`;
        else
            query = `organisationUnits?filter=id:eq:${ancestorId}&fields=children[id,displayName]`;

        fetchDataFromDHIS2(query).then(({organisationUnits}) => organisationUnits).
        then(orgUnits => {
            if(ancestorId == null)
                orgUnits[0].children = orgUnits;

            if(orgUnits[0] != null && orgUnits[0].children != null && orgUnits[0].children.length > 0)
            {
                var id = `org-level-${level}`;
                /*var query = 'organisationUnits?fields=children~isNotEmpty~rename(haveChildren)&filter=id:in:[';
                for(var i = 0; i < orgUnits[0].children.length){
                    ids.push(orgUnits[0].children[i].id);
                }
                fetchDataFromDHIS2()*/
                $('#levels')[0].appendChild(sList(id));
                setSelectTitle($(`#${id}`)[0], `${title} ${level}`);
                addOptions($(`#org-level-${level}`)[0], orgUnits[0].children.sort(compare));
                levels.push(orgUnits[0].children);
                exportToTable('org-table', levels, level);
            }
            else
                console.log("No more levels!");

         }).then(()=>{
            loader.setAttribute("class", "");
        });
    }
    var changeOrgUnit = (event) => {
        var level = parseInt(event.target.id.split('-')[2]);
        var targetId = $(`#${event.target.id}`);

        if(level == levels.length)
            addLevel(targetId[0].value, level+1);
        else {
            clearLevels(level+1);
            if(!targetId[0].value.match(title))
                addLevel(targetId[0].value, level+1);
        }
    }
    var clearLevels = (level) => {
        for(var i = level; i <= levels.length; i++){
            $(`#org-level-${i}`).remove();
        }
        levels = levels.slice(0, level-1);
    }
    var compare =(a,b) => {
        if (a.displayName < b.displayName)
            return -1;
        if (a.displayName > b.displayName)
            return 1;
        return 0;
    }

    var loader = $("#org-loader")[0];
    var levels = [[]];
    const title = "Select level";
    addLevel(null, 1);
}
$(window).on('load', loadOrgChooser);