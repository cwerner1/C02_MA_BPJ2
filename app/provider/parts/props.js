import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';


export default function(group, element, translate) {

    // Only return an entry, if the currently selected
    // element is a start event.
    const bo = element.businessObject;
    if (bo && bo.documentation && bo.documentation.length > 0) {
        debugger;
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

            group.entries.push(entryFactory.label(translate, {
                id : 'Id',
                value: 'asdfsadf',
                description : 'Apply a black magic spell',
                label : 'asdfsdf',
                modelProperty : 'spell'
            }));
        });
    }
}
