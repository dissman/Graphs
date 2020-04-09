'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Graph = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mathjs = require('mathjs');

var math = _interopRequireWildcard(_mathjs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graph = exports.Graph = function () {
    function Graph(network) {
        var _this = this;

        _classCallCheck(this, Graph);

        this.edgesIds = [];
        this.nodesIds = [];
        network.body.data.nodes.forEach(function (node) {
            _this.nodesIds.push(node.id);
        });
        Object.keys(network.body.edges).forEach(function (edge) {
            _this.edgesIds.push(edge);
        });
        console.log(this.nodesIds, this.edgesIds);
        this.__builtMatrix(network);
        console.log(this.matrix);
    }

    _createClass(Graph, [{
        key: '__getNodeById',
        value: function __getNodeById(id, network) {
            var nodes = network.body.nodes;
            var edges = network.body.edges;
            var exactNode = undefined;
            for (var node in nodes) {
                if (nodes.hasOwnProperty(node) && nodes[node].id === id) {
                    exactNode = nodes[node];
                    break;
                }
            }
            var doneEdges = [];
            exactNode.edges.forEach(function (edge) {
                if (edge.fromId === exactNode.id) doneEdges.push({
                    id: edge.id,
                    from: edge.fromId,
                    to: edge.toId,
                    arrowed: edge.options.arrows.to.enabled
                });
            });
            return {
                node: exactNode,
                edges: doneEdges
            };
        }
    }, {
        key: '__findIndexByLineAndColumn',
        value: function __findIndexByLineAndColumn(line, column, matrix) {
            var size = matrix.size()[0];
            var lineIndex = undefined;
            var columnIndex = undefined;
            for (var i = 1; i < size; i++) {
                if (matrix.get([i, 0]) === line) lineIndex = i;
                if (matrix.get([0, i]) === column) columnIndex = i;
            }
            return [lineIndex, columnIndex];
        }
    }, {
        key: '__builtMatrix',
        value: function __builtMatrix(network) {
            var _this2 = this;

            var nodes = [];
            var size = this.nodesIds.length + 1;
            var matrix = math.zeros(size, size);
            for (var i = 1; i < size; i++) {
                matrix.set([0, i], this.nodesIds[i - 1]);
                matrix.set([i, 0], this.nodesIds[i - 1]);
            }
            this.nodesIds.forEach(function (nodeId) {
                nodes.push(_this2.__getNodeById(nodeId, network));
            });
            nodes.forEach(function (node) {
                node.edges.forEach(function (edge) {
                    if (edge.arrowed) {
                        console.log(edge);
                        var indexes = _this2.__findIndexByLineAndColumn(edge.from, edge.to, matrix);
                        console.log(indexes);
                        var value = matrix.get(indexes);
                        matrix.set(indexes, value + 1);
                    } else {
                        var _indexes = _this2.__findIndexByLineAndColumn(edge.from, edge.to, matrix);
                        var _value = matrix.get(_indexes);
                        matrix.set(_indexes, _value + 1);
                        _indexes = [_indexes[1], _indexes[0]];
                        matrix.set(_indexes, _value + 1);
                    }
                });
            });
            this.matrix = matrix;
        }
    }]);

    return Graph;
}();

// {
//     id: edge.id,
//     from: edge.fromId,
//     to: edge.toId,
//     arrowed: edge.options.arrows.to.enabled
// }