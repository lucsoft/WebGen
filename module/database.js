console.log("Loaded Module: lucsoft.database 2018 by lucsoft");
var database = []; 
database.apiurl = "/database/";
database.loggedIn = false;
database.profile = {};
database.checklogin = function(url,email2,password2,callback) {
    
    getJson(url + "database.php?type=checklogin",{email:email2,password:password2},(e)=> {
        if(!e.login) {
            callback(false);
            console.error("Failed to Login => wrong password or email");
        } else {
            database.userinfo = e;
            database.loggedIn= true;
            callback(e);
        }
    });
}
database.profile.checkAdmin = (callback) => {
    database.getAccount(database.account.id, (e)=>{ (e.admin) ? callback(true) : callback(false); });

}
database.profile.resetPassword = (settings) => {
    getJson(database.apiurl + "database.php?type=resetpassword",{email:database.account.email,password:database.account.password,user:settings},(e)=> {

    });
};
database.profile.deleteAccount = (callback)  => {
    getJson(database.apiurl + "database.php?type=removeuser",{email:database.account.email,password:database.account.password,user:{id:database.account.id}},(e)=> {
        callback();
    });
}
database.profile.setSettings = (settings,callback)  =>{
    
    settings['id'] = database.account.id;
    getJson(database.apiurl + "database.php?type=edituser",{email:database.account.email,password:database.account.password,user:settings},(e)=> {
        database.reloading(callback);
    });
}
database.profile.getData = (data,callback)  =>{

    getJson(database.apiurl + "database.php?type=" + data,{email:database.account.email,password:database.account.password},(e)=> {
        callback(e);
    });
}

database.getAccounts = function(callback) {
    getJson(database.apiurl + "database.php?type=getusers",database.account,(e)=> {
        callback(e);
    });
}
database.getAccount = function(id,callback) {
    getJson(database.apiurl + "database.php?type=getuser&id=" + id,database.account,(e)=> {
        callback(e.user);
    });
}
database.editAccount = function(settings,callback) {
    getJson(database.apiurl + "database.php?type=edituser",{email:database.account.email,password:database.account.password,user:settings},(e)=> {
        callback(e);
     });
};
database.createAccount = function (settings,requestname,callback) {
    getJson(database.apiurl + "database.php?type=adduser",{email: database.account.email, password: database.account.password,requestname: requestname, user: settings},(e)=> {
        callback(e);
    });   
}

//DECAING:
database.checkIfAdmin = function(callback) {
    console.warn("database.checkIfAdmin is decaying use database.profile.checkAdmin");
    database.getAccount(database.account.id, (e)=>{ (e.admin) ? callback(true) : callback(false); });

}
database.resetPasswordAccount = function(settings) {
    console.warn("database.resetPasswordAccount is decaying use database.profile.resetPassword");
    getJson(database.apiurl + "database.php?type=resetpassword",{email:database.account.email,password:database.account.password,user:settings},(e)=> {

    });
};
database.editMyAccount = function(settings,callback) {
    console.warn("database.editMyAccount is decaying use database.profile.setSettings");
    settings['id'] = database.account.id;
    getJson(database.apiurl + "database.php?type=edituser",{email:database.account.email,password:database.account.password,user:settings},(e)=> {
        database.reloading(callback);
    });
}

database.deleteMyAccount = function (callback) {
    console.warn("database.deleteMyAccount is decaying use database.profile.deleteAccount");
    getJson(database.apiurl + "database.php?type=removeuser",{email:database.account.email,password:database.account.password,user:{id:database.account.id}},(e)=> {
        callback();
    });
}
database.deleteAccount = function (id,callback) {
    getJson(database.apiurl + "database.php?type=removeuser",{email:database.account.email,password:database.account.password,user:{id:id}},(e)=> {
        callback();
    });
}

database.login = function(email, password, error2,callback) {
    
    database.checklogin(database.apiurl, email,password,(e) => {
        if(e == false) {
            error2();
        } else {
            database.loadSettings();
            database.account = {email: email, password:password, id: e.user.id, name: e.user.name};
            try {
                database.profile["email"] = email;
                database.profile["password"] = password;
                database.profile["id"] = e.user.id;
                database.profile["nameraw"] = e.user.name;
                database.profile["name"] = `${e.user.name[0]} ${e.user.name[1]}`;
                
                $("#replacename").html(`${e.user.name[0]} ${e.user.name[1]}`);
            } catch {
                
            }
            callback(e);
        }
        
    });
}
database.reloading = function(callback) {
    database.checklogin(database.apiurl, database.account.email,database.account.password,(e) => {
        if(e == false) {
        } else {
            database.loadSettings();
            database.account = {email: database.account.email, password:database.account.password, id: e.user.id, name: e.user.name};
            try {
                $("#replacename").html(`${e.user.name[0]} ${e.user.name[1]}`);
            } catch {

            }
            callback(e);
            
        }
        
    });
};
database.loadSettings = function() {
    if(database.userinfo.user.theme) {
        ChangeTheme(database.userinfo.user.theme, () => {});
    }
}