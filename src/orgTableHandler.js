/**
 * Created by Magnus on 15.05.2017.
 */

var exportToTable = (tableId, levels, level) =>
{
    var cleanTable = (tableId) =>
    {
        $(`#${tableId}`).children('tr').remove(); //:not(:first)
    }
    var createCheckBox = (id) => {
        var cBox = document.createElement("input");
        cBox.setAttribute("type", "checkbox")
        cBox.setAttribute("value", id);
        return cBox;
    }
    var createCell = (val) =>
    {
        var c = document.createElement("td");
        c.innerText = val;
        return c;
    }
    var createRow = (rowId, values) =>
    {
        var r = document.createElement("tr");
        r.setAttribute("id", rowId);
        for (var i = 0; i < values.length; i++) {
            r.appendChild(createCell(values[i]));
        }
        var c = createCell('');
        c.appendChild(createCheckBox(rowId));
        r.appendChild(c);
        return r;
    }



    cleanTable(tableId);
    console.log("Table output after clean:", $(`#${tableId}`));
    for (var i = 0; i < levels[level - 1].length; i++) {
        $(`#${tableId}`)[0].appendChild(createRow(levels[level - 1][i].id,
            [levels[level - 1][i].displayName]));
    }


}