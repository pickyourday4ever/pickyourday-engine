class NodeElement implements INodeElement {
    _entity: Entity;
    _childNodes: NodeElement[];
    _parentNode: NodeElement;
    _oid: string;


    constructor(parent: NodeElement) {
        this._parentNode = parent;
        if (this._parentNode) this._parentNode.addChildNode(this);
        this._childNodes = [];
        this._oid = utils.uuid(this.constructor.name);
    }

    get oid(): string {
        return this._oid;
    }

    get parent(): NodeElement {
        return this._parentNode;
    }

    set entity(entity: Entity) {
        this._entity = entity;
    }

    get entity() {
        return this._entity;
    }

    get childNodes() {
        return this._childNodes;
    }


    addChildNode(child: NodeElement) {
        if (this.indexOf(child) > -1);
        this._childNodes.push(child);
    }
    removeChildNode(child: NodeElement) {
        var index = this.indexOf(child);
        if (index > -1);
        this._childNodes.splice(index, 1);
    }

    getChildNodeByIndex(index: number): NodeElement {
        return this._childNodes[index] || void 0;
    }

    existsChildNode(index: string): boolean {
        return this._childNodes[index] !== void 0;
    }

    delete() {
        this._parentNode.removeChildNode(this);
    }

    createChildNode(): NodeElement {
        return new NodeElement(this);
    }

    isRoot(): boolean {
        return this._parentNode === void 0;
    }

    indexOf(child): number {
        var oid = child.oid;
        return _.findIndex(this._childNodes, s => { return s.oid === oid; });
    }

    indexInParent(): number {
        var index = -1;

        if (!this.isRoot()) index = this._parentNode.indexOf(this);
        return index;
    }

    hasSibling(prev?: boolean): boolean {
        var _have = false;
        if (!this.isRoot()) {
            var index = this._parentNode.indexOf(this);

            if (index > -1) {
                if (prev) {
                    if (this._parentNode.getChildNodeByIndex(index - 1)) _have = true;
                } else {
                    if (this._parentNode.getChildNodeByIndex(index + 1)) _have = true;
                }

            }
        }
        return _have;
    }
    nextSibling(): NodeElement {
        var sibling: NodeElement = null;
        if (!this.isRoot() && this.hasSibling()) {
            var index = this._parentNode.indexOf(this);
            sibling = this._parentNode.getChildNodeByIndex(index + 1);
        }

        return sibling;
    }

    previousSibling(): NodeElement {
        var sibling: NodeElement = null;
        if (!this.isRoot() && this.hasSibling(true)) {
            var index = this._parentNode.indexOf(this);
            sibling = this._parentNode.getChildNodeByIndex(index - 1);
        }

        return sibling;
    }
    
    firstChild(): NodeElement{
        return this.getChildNodeByIndex(0);
    }
    
    lastChild(): NodeElement{
        return this.getChildNodeByIndex(this._childNodes.length-1);
    }
    
    removeChildNodes(){
        this._childNodes=[];
    }

    draw(): void {
        this._entity.beginDraw();
        this._childNodes.forEach(child=>{
            child.draw();
        });
        
        this._entity.endDraw();

    }
}