
module.exports=getdate;

function getdate(){
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var day = new Date().toLocaleDateString("en-CA", options);
    return day;
}
