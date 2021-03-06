export class NodeCreator {
    static getSerializedNode(nodeObject) {
        return {
            type: 'node',
            id: nodeObject.id,
            label: nodeObject.options.label,
            color: nodeObject.options.color,
            shape: nodeObject.shape.labelModule.elementOptions.shape
        }
    }

    static getReadyForUseNode(serializedNode) {
        return {
            id: serializedNode.id,
            label: serializedNode.label,
            color: serializedNode.color,
            shape: serializedNode.shape
        }
    }
}
