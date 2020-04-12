import * as math from 'mathjs'


export class Graph {
    constructor(network) {
        this.edgesIds = [];
        this.nodesIds = [];
        network.body.data.nodes.forEach((node) => {
            if (typeof node.id === 'string' && !node.id.startsWith('edgeId:'))
                this.nodesIds.push(node.id)
            if (typeof node.id !== 'string')
                this.nodesIds.push(node.id)
        })
        Object.keys(network.body.edges).forEach((edge) => {
            this.edgesIds.push(edge)
        })
        try {
            this.__builtMatrix(network)
        } catch (e) {
            this.matrix = math.matrix([])
        }
    }


    __getNodeById(id, network) {
        const nodes = network.body.nodes
        const edges = network.body.edges
        let exactNode = undefined
        for (const node in nodes) {
            if (nodes.hasOwnProperty(node)
                && nodes[node].id === id) {
                exactNode = nodes[node]
                break
            }
        }
        const doneEdges = []
        exactNode.edges.forEach(edge => {
            if (edge.fromId === exactNode.id)
                doneEdges.push(
                    {
                        id: edge.id,
                        from: edge.fromId,
                        to: edge.toId,
                        arrowed: edge.options.arrows.to.enabled
                    })
        })
        return {
            node: exactNode,
            edges: doneEdges
        }
    }

    __findIndexByLineAndColumn(line, column, matrix) {
        const size = matrix.size()[0]
        let lineIndex = undefined
        let columnIndex = undefined
        for (let i = 1; i < size; i++) {
            if (matrix.get([i, 0]) === line)
                lineIndex = i
            if (matrix.get([0, i]) === column)
                columnIndex = i
        }
        return [lineIndex, columnIndex]
    }

    __builtMatrix(network) {
        const nodes = []
        const size = this.nodesIds.length + 1
        const matrix = math.zeros(size, size)
        for (let i = 1; i < size; i++) {
            matrix.set([0, i], this.nodesIds[i - 1])
            matrix.set([i, 0], this.nodesIds[i - 1])
        }
        this.nodesIds.forEach(nodeId => {
            nodes.push(this.__getNodeById(nodeId, network))
        })
        nodes.forEach(node => {
            node.edges.forEach(edge => {
                let indexes = this.__findIndexByLineAndColumn(edge.from, edge.to, matrix)
                let value = matrix.get(indexes)
                if (edge.arrowed) {
                    matrix.set(indexes, value + 1)
                } else {
                    matrix.set(indexes, value + 1)
                    indexes = [indexes[1], indexes[0]]
                    value = matrix.get(indexes)
                    matrix.set(indexes, value + 1)
                }
            })
        })
        this.matrix = matrix
    }

    getMatrix() {
        return this.matrix
    }

    isConnected() {
        return Graph.checkConnections(
            Graph.setOnesToDiagonal(
                this.getValuesMatrix()
            )
        )
    }

    static setOnesToDiagonal(array) {
        const size = array.length
        const arr = array.slice()
        for (let i = 0; i < size; i++) {
            arr[i][i] = 1
        }
        return arr
    }

    getValuesMatrix() {
        const matrix = this.matrix.clone().toArray()
        matrix.shift()
        for (let i = 0; i < matrix.length; i++) {
            matrix[i].splice(0, 1)
        }
        return matrix
    }

    static checkConnections(matrix) {
        const size = matrix.length
        const rez = Graph.matrixPow(size, matrix)
        if (!rez) return undefined
        let connected = true
        rez.forEach(line => {
            line.forEach(element => {
                if (element <= 0) {
                    connected = false
                    return connected
                }
            })
        })
        return connected
    }

    static multiplyMatrix(matrixA, matrixB) {
        const rowsA = matrixA.length, colsA = matrixA[0].length,
            rowsB = matrixB.length, colsB = matrixB[0].length,
            rezMatrix = [];
        if (colsA !== rowsB) return false;
        for (let i = 0; i < rowsA; i++) rezMatrix[i] = [];
        for (let k = 0; k < colsB; k++) {
            for (let i = 0; i < rowsA; i++) {
                let t = 0;
                for (let j = 0; j < rowsB; j++) t += matrixA[i][j] * matrixB[j][k];
                rezMatrix[i][k] = t;
            }
        }
        return rezMatrix;
    }

    static matrixPow(pow, matrix) {
        if (pow === 0) return undefined
        if (pow === 1) return matrix;
        else return this.multiplyMatrix(matrix, Graph.matrixPow(pow - 1, matrix));
    }
}
