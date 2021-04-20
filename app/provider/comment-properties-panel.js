import props from './parts/props';

// Create the custom magic tab.
// The properties are organized in groups.
function createPropertiesTab(element, translate, bus) {
    // Create a group called "Black Magic".
    var blackMagicGroup = {
        id: 'commentsTab',
        label: 'Comments',
        entries: []
    };

    // Add the spell props to the black magic group.
    props(blackMagicGroup, element, translate, bus);

    return [
        blackMagicGroup
    ];
}

export default function CommentPropertiesPanel(propertiesPanel, translate, bus) {
    // Register our custom magic properties provider.
    // Use a lower priority to ensure it is loaded after the basic BPMN properties.
    propertiesPanel.registerProvider(500, this);
    console.log(propertiesPanel);

    this.getTabs = function(element) {

        return function(entries) {
            // Add the "magic" tab
            var magicTab = {
                id: 'comments',
                label: 'Comments',
                groups: createPropertiesTab(element, translate, bus)
            };

            entries.push(magicTab);
            return entries;
        }
    };
}

CommentPropertiesPanel.$inject = [ 'propertiesPanel', 'translate', 'eventBus']
