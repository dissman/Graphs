import {ISquareMatrix} from "./squareMatrixInterface";

export interface IGraphStatic {
    new(matrix: ISquareMatrix, type: string): IGraph

    getReachabilityMatrix(matrix: ISquareMatrix): ISquareMatrix

    checkConnectionsStrict(matrix: ISquareMatrix): boolean | undefined

    getMatrixFromNetwork(network: any): ISquareMatrix

    getConnectivityFromNetwork(network: any): string

    isConnected(matrix: ISquareMatrix): boolean | undefined
}


export interface IGraph {
    isConnected(): boolean | undefined

    hasEulerCycle(): boolean

    getType(): string
}
