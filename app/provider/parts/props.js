import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';


export default function(group, element, translate, bus) {

    // Only return an entry, if the currently selected
    // element is a start event.
    const bo = element.businessObject;
    console.log(element);
    const table = {};
    table.headers = [
        'Author', 'Comment'
    ];
    table.rows = [];
    if (bo && bo.documentation && bo.documentation.length > 0) {
        const comments = bo.documentation[0].text.split(';');
        comments.forEach(comment => {
            const parts = comment.split(':');
            let author = '';
            let commentText = '';
            if (parts.length > 1) {
                author = parts[0];
                commentText = parts[1];
            } else {
                commentText = parts[0];
            }
            table.rows.push([author, commentText]);
        });
        group.entries.push(getTable({id: 'test', table}));
    }

}

let getHtml = function(options) {
    return {
        id: options.id,
        html: '<button>HI</button>'
    };
}

let getTable = function(options) {
    let html = '<table>';
    options.table.headers.forEach(header => {
        html += `<th>${header}</th>`;
    });

    options.table.rows.forEach(entry => {
        html += `<tr>`;
        entry.forEach(field => {
            html += `<td>${field}</td>`;
        });
        html += '</tr>';
    });

    return { id: options.id, html: html}
};
