module.exports = class ApplicationPolicy {
    constructor(user, record, collabo){
        this.user = user;
        this.record = record;
        this.collabo = collabo;
    }

    _isOwner(){
        return this.record && (this.record.userId == this.user.id);
    }

    _isAdmin(){
        return this.user && this.user.role == 2;
    }

    _isPremium(){
        return this.user && this.user.role == 1;
    }

    _isCollabo(){
        return this.collabo;
    }

    new(){
        return this.user != null;
    }

    create(){
        return this.new();
    }

    showPrivate(){
        return this.record && (this._isPremium() || this._isAdmin() || this._isCollabo() );
    }

    edit(){
        console.log("went inside of edit method in application");
        return this.record && (this._isOwner() || this._isAdmin() || this._isCollabo()); 
    }

    update(){
        return this.edit();
    }

    destroy() {
        return this.update();
    }
}