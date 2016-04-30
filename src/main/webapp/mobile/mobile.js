/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function getVarsUrl(){
    var url= location.search.replace("#", "");
    var arrUrl = url.split("&");
    var urlObj={};   
    for(var i=0; i<arrUrl.length; i++){
        var x= arrUrl[i].split("=");
        urlObj[x[0]]=x[1]
    }
    return urlObj;
}