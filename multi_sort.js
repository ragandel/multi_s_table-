function SortTable (id_table, arrNotSortCells){
        
        var nameClass = '.sort-table';                                                                                  //название класса таблицы для сортировки
        var namesTab = id_table.concat(nameClass);                                                                      //массив содержащий ID и класс сортируемых табли
	var fSort = 1;                                                                                                  //направление сортировки
	var indCell;                                                                                                    //индекс сортируемого столбца
	var id_T;                                                                                                       //текущий ID или Class сортируемой таблицы
 
	var _span_block ={
		_span_arrow : "<span class='rows'> <span class='up'> &#9650 </span> <span class='down'> &#9660 </span> </span>",
		_span_tTip : "<span class='tooltiptext'> Столбец пустой </span>"
	}
        function startPaintRows(arrNames){
                //прорисовка стрелок
                arrNames.forEach(function(item){
                        $(item + ' thead').find('.rows').remove();
                        $(_span_block._span_arrow).appendTo($(item + ' thead').find('th,td'));
                })
        }
        startPaintRows(namesTab);
        
	function toolTip(){
		//удаление подсказки
                var tr_head = $(this).parent();
		tr_head.find('.tooltiptext').remove();
		tr_head.find('.tool_tip').removeClass('tool_tip');
	}
	
	function trSort(arrData, arrObj, index) {
		//функция возвращает отсортированный объект строк
	        var count = arrObj.length;
		var item_1;
		var item_2;
		function _sort(){
			item_1 = arrData[j];
			arrData[j] = arrData[j+1];
			arrData[j+1] = item_1;
			item_2 = index[j];
			index[j] = index[j+1];
			index[j+1] = item_2;
                }
		for (var i = 0; i < count; i ++){
			for (var j = 0; j < count -1; j++){
				if (fSort == 1){
					if (arrData[j] > arrData[j+1]) {
						_sort();
					}
				}else {
					if (arrData[j] < arrData[j+1]) {
						_sort();
					}
				}
			}
		}
		var arrEnd = [];
                index.forEach(function(item){
                        //добавляем отсортированные строки таблицы в новый массив
	                arrEnd.push(arrObj[item]);
                })
		return arrEnd;
	}
 
	function selectData(){
		var arrTr =[];                  //масиив строк tr текущей таблицы
		var value;                      //значение ячейки
		var empty = 0;                  //показатель пустых ячеек
		var notSortFlag = 0;            //флаг отмены сортировки
		
	        var _arr = {
                        _index: {
                        	_ABC: [],
                                _Number: [],    //индексы строк с числовыми данными
                                _Space: [],     //индексы строк с неопределенными данными
                                _IP: [],        //индекс IP строк
                                _Date: []       //индекс даты
                        },
                        _data: {
                                _abc: [],       //массив строк
                                _number: [],    //массив  для числовых данных
                                _ip: [],        //массив IP адресов
                                _date: []       //массив  для хранения даты в ms
                        },
		        _name_domen:{
                                _htp : 'http://',
			        _htps : 'https://'
		        }
                }
		//массив объектов строк
		arrTr = $(id_T).find('tbody tr');
		//метод формирования алфавита IP, Date, Domen, string, number, empty
		function genAlp(value,i){
			if (value.length > 0){
				var valueStore;
				if ((isNaN(value))) {
					if( valueStore = value.match(/[1-9][0-9]{0,2}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)) {
					        //формирование алфавита IP
						var IP = String(valueStore).split('.');
						var hashIP = (IP[0] * 16777216)  + (IP[1]*65536)  + (IP[2] * 256) + IP[3]*1;
						_arr._data._ip.push(hashIP);
						_arr._index._IP.push(i);
					}else if(value.match(/[0-2][0-9]\:[0-5][0-9]\:[0-5][0-9]/) ||
						    value.match(/[1-9][0-9]{3}\-[0-1][0-9]\-[0-3][0-9]/)){
					        //анализ и формирование Date
                                                if(valueStore = value.match(/[1-9][0-9]{3}\-[0-1][0-9]\-[0-3][0-9]\s[0-2][0-9]\:[0-5][0-9]\:[0-5][0-9]/)){
	                                                //если формат " ****-**-** **:**:** "
	                                                _arr._data._date.push(Date.parse(valueStore));
	                                                _arr._index._Date.push(i);
                                                }else if(valueStore = value.match(/[0-2][0-9]\:[0-5][0-9]\:[0-5][0-9]\s[1-9][0-9]{3}\-[0-1][0-9]\-[0-3][0-9]/)){
	                                                //если формат " **:**:** ****-**-** "
	                                                _arr._data._date.push(Date.parse(valueStore));                  //сохраняем в массиве дату в ms
	                                                _arr._index._Date.push(i);
                                                }else if(valueStore = value.match(/[1-9][0-9]{3}\-[0-1][0-9]\-[0-3][0-9]/)){
	                                                //если формат " ****-**-** "
	                                                _arr._data._date.push(Date.parse(valueStore));                  //сохраняем в массиве дату в ms
	                                                _arr._index._Date.push(i);
                                                }else if(valueStore = value.match(/[0-2][0-9]\:[0-5][0-9]\:[0-5][0-9]/)){
	                                                //если формат " **:**:** "
                                                        var elDate = String(valueStore).split(':');
	                                                var storDate = elDate[0] * 100 + elDate[1] * 10 + elDate[2] + Date.now();
	                                                _arr._data._date.push(storDate);
	                                                _arr._index._Date.push(i);
                                                }
					}else if((valueStore = value.substr(0,8) == _arr._name_domen._htps) ||
						    (valueStore = value.substr(0,7) == _arr._name_domen._htp)){
						//формирование алфавита Domen
					        if(valueStore.length == 8)
						        _arr._data._abc.push(value[8].toLowerCase());
						else
						        _arr._data._abc.push(value[7].toLowerCase());
						_arr._index._ABC.push(i);
					}else {
					        //формирование алфавита строки
						_arr._data._abc.push(value[0].toLowerCase());
						_arr._index._ABC.push(i);
					}
				}else {
				        //формирование алфавита чисел
			   		_arr._data._number.push(+value);
					_arr._index._Number.push(i);
				}
			}else {
			        //формирование алфавита пустых ячееек
				empty++;                                                                                //счетчик пустых ячеек
				_arr._index._Space.push(i);                                                             //индекс пустых ячеек
			}
		}
		$.each(arrTr, function(i){
			var val = $(this).find('td,th').eq(indCell);
			if ($(val).find('input').length > 0){
				//выборка input  - text
				var el_Input = $(val).find('input');
				if (el_Input.filter(':text').length > 0){
					value = el_Input.filter(':text').val().trim();
					genAlp(value,i);
				} else if(el_Input.filter(':hidden').length > 0) {
					empty++;                                                                        //счетчик пустых ячеек
					_arr._index._Space.push(i);                                                     //индекс пустых ячеек
				}else if(el_Input.filter(':checkbox').length > 0) {
					value = el_Input.filter(':checkbox');
					if (value.prop('checked') == true) {
						_arr._data._number.push(1);
						_arr._index._Number.push(i);
					}else {
						empty++;                                                                //счетчик пустых ячеек
						_arr._index._Space.push(i);                                             //индекс пустых ячеек
					}
				}
			} else if ($(val).find('select').length > 0){
				//выборка input  - text
				value = $(val).find('select').val().trim();
				genAlp(value,i);
			}else if ($(val).find('textarea').length > 0){
				//выборка textarea
				value = $(val).find('textarea').val().trim();
				genAlp(value,i);
			}else{
				value = $(val).text();
				genAlp(value,i);
			}
		})
		
		if (empty != arrTr.length){
			//если столбец не пустой
		        //очищаем DOM от предыдущей таблицы
			var tbodyNew = $(id_T).find('tbody').empty();
			var arrData = [_arr._data._number,_arr._data._date,_arr._data._ip,_arr._data._abc];
			var arrIndex = [_arr._index._Number,_arr._index._Date,_arr._index._IP,_arr._index._ABC];
			if (fSort==1){
				if (_arr._index._Space.length){
					//добавление алфавита пустых ячеек
					_arr._index._Space.forEach(function(item, i,arr){tbodyNew.append(arrTr[item]);});
				};
				arrData.forEach(function(item, i){
					if(item.length > 0)
						tbodyNew.append(trSort(item, arrTr, arrIndex[i]));
				});
			}else {
				arrData.forEach(function(item, index){
					if(arrData[arrData.length - index - 1].length > 0)
						tbodyNew.append(trSort(arrData[arrData.length - index -1],arrTr,arrIndex[arrData.length - index -1]));
				});
				if (_arr._index._Space.length){
					_arr._index._Space.forEach(function(item, i,arr){tbodyNew.append(arrTr[item]);});
				}
			}
		}else {
			notSortFlag = 1;
		}
		return notSortFlag;
	}
        
        var cellThead = $(namesTab.join(',')).find('th');                                                               //все th загловков namesTab
	var arrClikTable =[];                                                                                           //массив содержащий историю активных таблиц
        cellThead.click(function() {
                var nameIdClass = $(this).parent().parent().parent();                                                   //записываем имя ID или CLass
	        
                if (nameIdClass.attr('id'))
                        id_T = '#' + nameIdClass.attr('id');
                else if (nameIdClass.attr('class'))
                        id_T = '.' + nameIdClass.attr('class');
                
                indCell = $(this).index();
                
                if (arrNotSortCells.indexOf(indCell) == -1){                                                            //проверка что  в arrNotSortCells нет indCell
                        var notSortFlag = selectData();                                                                 //1 - столбец пустой, 0 - значения есть
                        
                        if ((arrClikTable.indexOf(id_T)!=-1) && (notSortFlag !=1) ){
	                        //восстанавливаем исходные стрелки и очищаем таблицу от данного id таблицы
                        	$(id_T).find('.up, .down').css('visibility','visible');
                                
                                while ($.inArray(id_T,arrClikTable) != -1 )
	                                //удаление имен таблиц
	                                arrClikTable.splice( $.inArray(id_T, arrClikTable), 1 );
	                }else if ((notSortFlag == 1)) {
	                        //проверка индекса столбца на сортировку
	                        //обавляем класс tooltip
	                        $(this).addClass('tool_tip');
	                        $(_span_block._span_tTip).appendTo($(this));
	                        setTimeout(toolTip.bind(this), 1000);
	                        $(id_T).find('.up, .down').css('visibility','visible');
	                }
                
	                //добавляем имя предыдущей активной таблицы в массив arrClikTable
	                arrClikTable.push(id_T);
	                
	                if (notSortFlag != 1){
		                var _css_arrow = (fSort) ? 'visible' : 'hidden';
		                var _css_not_arrow = (fSort) ? 'hidden' : 'visible';
		
		                $(id_T).find('.down').eq(indCell).css('visibility',_css_not_arrow);
		                $(id_T).find('.up').eq(indCell).css('visibility',_css_arrow);
		
		                fSort ^= 1;
	                }
                }
        });
}

