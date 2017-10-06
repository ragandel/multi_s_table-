function SortTable (id_table, arrNotSortCells){
	"use strict";
	var config = {
		nameClass: '.sort-table',                     //название класса таблицы для сортировки
		regExp: {
			_ip: /[1-9][0-9]{0,2}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,
			_time: /[0-2][0-9]\:[0-5][0-9]\:[0-5][0-9]/,
			_date: /[1-9][0-9]{3}\-[0-1][0-9]\-[0-3][0-9]/,
			_date_time: /[1-9][0-9]{3}\-[0-1][0-9]\-[0-3][0-9]\s[0-2][0-9]\:[0-5][0-9]\:[0-5][0-9]/,
			_time_date: /[0-2][0-9]\:[0-5][0-9]\:[0-5][0-9]\s[1-9][0-9]{3}\-[0-1][0-9]\-[0-3][0-9]/
		},
		_span_block : {
			_span_arrow: "<span class='rows'> <span class='up'> &#9650 </span> <span class='down'> &#9660 </span> </span>",
			_span_tTip: "<span class='tooltiptext'> Столбец пустой </span>"
		}
	}
        var namesTab = id_table.concat(config.nameClass);     //массив содержащий ID и класс сортируемых табли
	var fSort = 1;                                        //направление сортировки
	var indCell;                                          //индекс сортируемого столбца
	var id_T;                                             //текущий ID или Class сортируемой таблицы
	
	function toolTip(){
		//удаление подсказки
                let tr_head = $(this).parent();
		tr_head.find('.tooltiptext').remove();
		tr_head.find('.tool_tip').removeClass('tool_tip');
	}
	
	function trSort(arrData, arrObj, index) {
		//функция возвращает отсортированный объект строк
	        let  count = arrObj.length;
		let  arrEnd = [];
		
		for (let i = 0; i < count; ++i){
			for (let j = 0; j < count -1; ++j){
				if ((fSort == 1 && arrData[j] > arrData[j+1]) ||
					(fSort != 1) && arrData[j] < arrData[j+1]) {
					let item_1;
					let item_2;
					
					item_1 = arrData[j];
					arrData[j] = arrData[j+1];
					arrData[j+1] = item_1;
					item_2 = index[j];
					index[j] = index[j+1];
					index[j+1] = item_2;
				}
			}
		}
		
                index.forEach(function(item){
                        //добавляем отсортированные строки таблицы в новый массив
	                arrEnd.push(arrObj[item]);
                })
		return arrEnd;
	}
 
	function selectData(){
		let arrTr = [];                 //масиив строк tr текущей таблицы
		let value;                      //значение ячейки
		let empty = 0;                  //показатель пустых ячеек
		let notSortFlag = 0;            //флаг отмены сортировки
	        let _arr = {
                        _index: {
                        	_ABC: [],
                                _Number: [],    //индексы строк с числовыми данными
                                _Space: [],     //индексы строк с неопределенными данными
                                _IP: [],        //индекс IP строк
                                _date: []       //индекс даты
                        },
                        _data: {
                                _abc: [],       //массив строк
                                _number: [],    //массив  для числовых данных
                                _ip: [],        //массив IP адресов
                                _date: []       //массив  для хранения даты в ms
                        },
		        _name_domen:{
                                _http: 'http://',
			        _https: 'https://'
		        }
                }
                
		//массив объектов строк
		arrTr = $(id_T).find('tbody tr');
		
		function genAlp(value,i){
			let valueStore;
			
			//метод формирования алфавита IP, Date, Domen, string, number, empty
			if(value.length <= 0){
				//формирование алфавита пустых ячееек
				++empty;                             //счетчик пустых ячеек
				_arr._index._Space.push(i);          //индекс пустых ячеек
				return;
			}
			
			if ((isNaN(value))) {
				if( valueStore = value.match(config.regExp._ip)) {
					//формирование алфавита IP
					let IP = String(valueStore).split('.');
					let hashIP = (IP[0]*16777216)  + (IP[1]*65536)  + (IP[2]*256) + IP[3]*1;
					_arr._data._ip.push(hashIP);
					_arr._index._IP.push(i);
				}else if(value.match(config.regExp._time) ||
					value.match(config.regExp._date)){
					//анализ и формирование Date
                                        if(valueStore = value.match(config.regExp._date_time)){
	                                        //если формат " ****-**-** **:**:** "
	                                        _arr._data._date.push(Date.parse(valueStore));
	                                        _arr._index._date.push(i);
                                        }else if(valueStore = value.match(config.regExp._time_date)){
	                                        //если формат " **:**:** ****-**-** "
	                                        _arr._data._date.push(Date.parse(valueStore));      //сохраняем в массиве дату в ms
	                                        _arr._index._date.push(i);
                                        }else if(valueStore = value.match(config.regExp._date)){
	                                        //если формат " ****-**-** "
	                                        _arr._data._date.push(Date.parse(valueStore));      //сохраняем в массиве дату в ms
	                                        _arr._index._date.push(i);
                                        }else if(valueStore = value.match(config.regExp._time)){
	                                        //если формат " **:**:** "
	                                        let elDate = String(valueStore).split(':');
	                                        let storDate = elDate[0]*100 + elDate[1]*10 + elDate[2] + Date.now();
	                                        _arr._data._date.push(storDate);
	                                        _arr._index._date.push(i);
                                        }
				}else if((valueStore = value.substr(0,8) == _arr._name_domen._https) ||
						(valueStore = value.substr(0,7) == _arr._name_domen._http)){
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
		}
		
		$.each(arrTr, function(i){
			let val = $(this).find('td,th').eq(indCell);
			if ($(val).find('input').length > 0){
				//выборка input  - text
				let el_Input = $(val).find('input');
				if (el_Input.filter(':text').length > 0){
					value = el_Input.filter(':text').val().trim();
					genAlp(value,i);
				} else if(el_Input.filter(':hidden').length > 0) {
					++empty;                                        //счетчик пустых ячеек
					_arr._index._Space.push(i);                     //индекс пустых ячеек
				}else if(el_Input.filter(':checkbox').length > 0) {
					value = el_Input.filter(':checkbox');
					if (value.prop('checked') == true) {
						_arr._data._number.push(1);
						_arr._index._Number.push(i);
					}else {
						++empty;                                 //счетчик пустых ячеек
						_arr._index._Space.push(i);              //индекс пустых ячеек
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
		
		if (empty == arrTr.length){
			notSortFlag = 1;
			return;
		}
		//если столбец не пустой
		//очищаем DOM от предыдущей таблицы
		let tbodyNew = $(id_T).find('tbody').empty();
		let _arr_data_ind = [
			{data: _arr._data._number, index: _arr._index._Number},
			{data: _arr._data._date, index: _arr._index._date},
			{data: _arr._data._ip, index: _arr._index._IP},
			{data: _arr._data._abc, index: _arr._index._ABC}
		];
		if (fSort == 1){
			if (_arr._index._Space.length){
				//добавление алфавита пустых ячеек
				_arr._index._Space.forEach(function(item, i, arr){tbodyNew.append(arrTr[item]);});
			};
			_arr_data_ind.forEach(function(item, i){
				if(item.data.length > 0)
					tbodyNew.append(trSort(item.data, arrTr, item.index));
			});
		}else {
			_arr_data_ind.forEach(function(item, index){
				if(_arr_data_ind[_arr_data_ind.length - index - 1].data.length > 0)
					tbodyNew.append(trSort(_arr_data_ind[_arr_data_ind.length - index - 1].data,
						arrTr,_arr_data_ind[_arr_data_ind.length - index - 1].index));
			});
			if (_arr._index._Space.length){
				_arr._index._Space.forEach(function(item, i, arr){tbodyNew.append(arrTr[item]);});
			}
		}
		return notSortFlag;
	}
	
	if(namesTab.length > 0){
		//стартовая прорисовка указателей сортировки
		namesTab.forEach(function(item){
			$(item + ' thead').find('.rows').remove();
			$(config._span_block._span_arrow).appendTo($(item + ' thead').find('th, td'));
		})
	}
	
	$(namesTab.join(',')).find('th').click(function() {
        	let _this_table = $(this).parents('table');     //записываем имя ID или CLass сортируемой таблицы
		
		id_T = (_this_table.attr('id')) ?  ('#' + _this_table.attr('id')) : ('.' + _this_table.attr('class'));
		
                indCell = $(this).index();
                
                if (arrNotSortCells.indexOf(indCell) == -1){    //проверка что  в arrNotSortCells нет indCell
                        let notSortFlag = selectData();         //1 - столбец пустой, иначе 0
                        
	                if(notSortFlag){
		                //проверка индекса столбца на сортировку
		                //обавляем класс tooltip
		                $(this).addClass('tool_tip');
		                $(config._span_block._span_tTip).appendTo($(this));
		                setTimeout(toolTip.bind(this), 1000);
		                $(id_T).find('.up, .down').css('visibility', 'visible');
		                return
	                }
	                //восстанавливаем исходные стрелки и очищаем таблицу от данного id таблицы
	                $(id_T).find('.up, .down').css('visibility', 'visible');
	                
	                let _css_arrow = (fSort) ? 'visible' : 'hidden';
	                let _css_not_arrow = (fSort) ? 'hidden' : 'visible';
		
	                $(id_T).find('.down').eq(indCell).css('visibility', _css_not_arrow);
	                $(id_T).find('.up').eq(indCell).css('visibility', _css_arrow);
		
	                fSort ^= 1;
                }
        });
}

