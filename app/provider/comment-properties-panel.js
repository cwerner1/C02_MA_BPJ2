import props from './parts/props';

// Create the custom magic tab.
// The properties are organized in groups.
function createPropertiesTab(element, translate) {
    // Create a group called "Black Magic".
    var blackMagicGroup = {
        id: 'black-magic',
        label: 'Black Magic',
        entries: []
    };

    // Add the spell props to the black magic group.
    props(blackMagicGroup, element, translate);

    return [
        blackMagicGroup
    ];
}

export default function CommentPropertiesPanel(propertiesPanel, translate) {

    // Register our custom magic properties provider.
    // Use a lower priority to ensure it is loaded after the basic BPMN properties.
    propertiesPanel.registerProvider(500, this);

    this.getTabs = function(element) {

        return function(entries) {
            // Add the "magic" tab
            var magicTab = {
                id: 'magic',
                label: 'Magic',
                groups: createPropertiesTab(element, translate)
            };

            entries.push(magicTab);
            return entries;
        }
    };
}

CommentPropertiesPanel.$inject = [ 'propertiesPanel', 'translate']
