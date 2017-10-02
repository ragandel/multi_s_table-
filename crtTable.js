/*********************************************************************************************************/
/* Формирование таблицы */
/*********************************************************************************************************/
var stateSort;
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
var indexSelect;
var valuePresSelect = 0;
var valueRow = 0;
var valueColumn=0;
var valueTable = 0;
var tableElement;
var tableTypeData = {
    1 : "<input type='text' size='20'>",
    2 : "<input type='hidden' size='20'>",
    3 : "<input type='checkbox'>",
    4 : "<p> </p>",
    5 : "<select><option> </option><option> </option><option> </option><option> </option><option> </option><option> </option></select>"
}

var NameHeader = {
    1 : "ID",
    2 : "MAC",
    3 : "IP",
    4 : "StatePower",
    5 : "FunSpeed",
    6 : "State Mode",
    7 : "Computing value",
    8 : "Number of scheme",
    9 : "Data start run ",
    10 : "Data stop",
    11 : "Temp",
    12 : "CPU",
    13 : "Number of NVIDA",
    14 : "Serial Number",
    15 : "Position in Computer rack"
}

var clas = {
    1 : "sort",
    2 : "sort",
    3 : "table-sort",
    4 : "sort",
    5 : "sort",
    6 : "sort",
    7 : "sort",
    8 : "sort",
    9 : "sort",
    10 : "sort",
    11 : "sort",
    12 : "sort",
    13 : "sort",
    14 : "sort",
    15 : "sort"
}

$('body').append("<div class='header'> <span class='numTable'> Количество таблиц </span> <span class='numColumn'> Количество колонок </span> <span class='numRow'> Количество строк</span> <button> Построить таблицу</button> </div>");
$('.header > span').append('<select> </select>');
for (var i=0; i < 1000; i++){
    $('.header > span >select').append("<option>" + " " + i +" " +"</option>");
}
var selectHeader = $('.header > span > select');
selectHeader.click(function(e){
    indexSelect = selectHeader.index(this);
    valuePresSelect = $(selectHeader).eq(indexSelect);
    switch($(valuePresSelect).parent().attr('class')){
        case 'numRow': valueRow = $(valuePresSelect).val();
        break;
        case 'numColumn': valueColumn = $(valuePresSelect).val();
        break;
        case 'numTable': valueTable = $(valuePresSelect).val();
        break;
    }
})
$('.header > button').click(function(e){
$('.container').remove();
$("body").append("<div class='container'> </div>")
    if (valueTable > 0){
            for ( var i=0; i < valueTable; i ++){
            tableElement = "<table id="+ i + " " + "class=" + clas[getRandomArbitrary(1,14)] + "> <thead> </thead> <tbody> </tbody> </table>";
            $('.container').append(tableElement);
        }
        /*Добавление колонок*/
        function column(){
            $('.container > table > thead ').append("<tr> </tr>");
            for ( var i=0; i < valueColumn; i ++){
                var j = NameHeader[getRandomArbitrary(1,15)];
                if (getRandomArbitrary(1, 6) > 3 ){
                    $('.container thead tr ').append("<th>" + j + "</th>");
                }else {
                    $('.container thead tr ').append("<th>" + j + "</th>");
                }
            }
        }
        function rows(){
            var arrIndex =[];
            for ( var i=0; i < valueColumn; i ++){
                arrIndex.push(getRandomArbitrary(1,6))
            }
            for ( var n=0; n < valueRow; n ++){
                $('.container > table > tbody ').append("<tr> </tr>");
            }
            for ( var i=0; i < valueColumn; i ++){
                $('.container > table > tbody > tr ').append("<td>" + tableTypeData[arrIndex[i]] + "</td>");
            }
        }
        column();
        rows();
        $('.container p').each(function(index){$(this).append(getRandomArbitrary(1,2000))})
        $('.container option').each(function(index){$(this).append(makeid())});
       SortTable(['#0','#1'], []);
    }
})