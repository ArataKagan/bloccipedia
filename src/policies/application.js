module.exports = class ApplicationPolicy {
    constructor(user, record){
        this.user = user;
        this.record = record;
    }

    _isOwner(){
        return this.record && (this.record.userId == this.user.id);
    }

    _isAdmin(){
        return this.user && this.user.role == 2;
    }

    new(){
        return this.user != null;
    }

    create(){
        return this.new();
    }

    show(){
        return true;
    }

    edit(){
        return this.new() && 
            this.record && (this._isOwner() || this._isAdmin()); //user is allowed to create, the record is present and either owner or admin can edit
    }

    update(){
        return this.edit();
    }

    destroy() {
        return this.update();
    }
}