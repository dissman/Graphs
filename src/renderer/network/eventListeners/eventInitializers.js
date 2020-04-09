const dialogs = require('dialogs');
const Dialogs = dialogs();

export class EventInitializer {

    constructor(parent) {
        this.parent = parent
    }

    initDeletion(selection, setterAndRemover, eventListeners) {
        setterAndRemover.remover(eventListeners)
        if (selection.nodes)
            selection.nodes.forEach((node) => {
                this.__removeNode(node)
            })
        if (selection.edges)
            selection.edges.forEach((edge) => {
                this.__removeEdge(edge)
            })
        setterAndRemover.setter(eventListeners)
    }


    initEditNode(nodeId, setterAndRemover, eventListeners) {
        setterAndRemover.remover(eventListeners)
        Dialogs.prompt('Input node\'s new value: ', newValue => {
            if (newValue !== undefined) {
                this.__editNode(nodeId, newValue)
            }
            setterAndRemover.setter(eventListeners)
        });
    }


    initAddNode(x, y, emptyNode, setterAndRemover, eventListeners) {
        setterAndRemover.remover(eventListeners)
        const node = {};
        const id = (Math.random() * 1e7).toString(32);
        if (!emptyNode)
            Dialogs.prompt('Input new node value: ', value => {
                if (value !== undefined) {
                    node.id = id;
                    node.label = value;
                    node.x = x;
                    node.y = y;
                    this.__addNode(node)
                }
                setterAndRemover.setter(eventListeners)
            });
        else {
            this.__addNode({id: id, x, y})
            setterAndRemover.setter(eventListeners)
        }
    }

    __addNode(node) {
        this.parent.network.body.data.nodes.add(node)
    }

    __editNode(nodeId, newValue) {
        this.parent.network.body.data.nodes.update({id: nodeId, label: newValue})
    }

    __removeNode(nodeId) {
        this.parent.network.body.data.nodes.remove({id: nodeId})
    }

    __removeEdge(edgeId) {
        this.parent.network.body.data.edges.remove({id: edgeId})
    }
}