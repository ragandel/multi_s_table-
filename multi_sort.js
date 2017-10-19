function SortTable (id_table, arrNotSortCells){
	"use strict";
	var config = {
		nameClass: '.sort-table',                     //название класса таблицы для сортировки
		regExp: {
			_ip: /[1-9][0-9]{0,2}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,
			_time: /[0-2][0-9]\:[0-5][0-9]\:[0-5][0-9]/,
			_date: /[1-9][0-9]{3}\-[0-1][0-9]\-[0-3][0-9]/,
			_date_time: /[1-9][0-9]{3}\-[0-1][0-9]\-[0-3][0-9]\s[0-2][0-9]\:[0-5][0-9]\:[0-5][0-9]/,
			_time_date: /[0-2][0-9]\:[0-5][0-9]\:[0-5][0-9]\s[1-9][0-9]{3}\-[0-1][0-9]\-[0-3][0-9]/,
			_http: /http:/i,
			_https: /https:/i
		},
		_span_block: {
			_span_arrow: "<span class='rows'> <span class='up'> &#9650 </span>"+
			    "<span class='down'> &#9660 </span> </span>",
			_span_tTip: "<span class='tooltiptext'> Столбец пустой </span>"
		},
		_ptotocols: {
                        _http: 'http://',
			_https: 'https://'
		}
	}
        var namesTable = id_table.concat(config.nameClass);    //массив содержащий ID и класс сортируемых табли
	var fSort = true;                                      //направление сортировки
	var indCell;                                           //индекс сортируемого столбца
	var id_T;                                              //текущий ID или Class сортируемой таблицы
	
	function del_toolTip() {
		//удаление подсказки
                let tr_head = $(this).parent();
		tr_head.find('.tooltiptext').remove();
		tr_head.find('.tool_tip').removeClass('tool_tip');
	}

	function trSort(arrData, arrObj, index_arr) {
		//функция возвращает отсортированный объект строк
	        let  count = arrObj.length;
		
		for (let i = 0; i < count; ++i) {
			for (let j = 0; j < count -1; ++j) {
				if ((fSort && (arrData[j] > arrData[j+1])) ||
					(!fSort && (arrData[j] < arrData[j+1]))) {
					let item_1;
					let item_2;
					
					item_1 = arrData[j];
					arrData[j] = arrData[j+1];
					arrData[j+1] = item_1;
					item_2 = index_arr[j];
					index_arr[j] = index_arr[j+1];
					index_arr[j+1] = item_2;
				}
			}
		}
		return index_arr.map(function(name) {
			//массив с отсортированными строками
			let index = name;
			return arrObj[index];
		});
	}

	function selectData() {
		let arrTr = [];                 //масиив строк tr текущей таблицы
		let value;                      //значение ячейки
		let empty = 0;                  //показатель пустых ячеек
	        let dateTypes = {
                        abc: {index: [], data: []},
                        number: {index: [], data: []},
                        ip: {index: [], data: []},
                        date: {index: [], data: []},
                        space: {index: [], data: []},
                }

		arrTr = $(id_T).find('tbody tr');
		//массив объектов строк

		function genAlp(value,i) {
			let valueStore;
			
			//метод формирования алфавита IP, Date, Domen, string, number, empty
			if(value.length <= 0) {
				//формирование алфавита пустых ячееек
				++empty;                             //счетчик пустых ячеек
				dateTypes.space.index.push(i);          //индекс пустых ячеек
				return;
			}

			if (!isNaN(value)) {
			        //формирование алфавита чисел
				dateTypes.number.data.push(+value);
				dateTypes.number.index.push(i);
			        return;
			}
			if( valueStore = value.match(config.regExp._ip)) {
				//формирование алфавита IP
				let IP = String(valueStore).split('.');
				let hashIP = (IP[0]*16777216)  + (IP[1]*65536)  + (IP[2]*256) + IP[3]*1;
				dateTypes.ip.data.push(hashIP);
				dateTypes.ip.index.push(i);
			}else if(value.match(config.regExp._time) ||
				value.match(config.regExp._date)) {
				//анализ и формирование Date
                                if(valueStore = value.match(config.regExp._date_time)) {
	                                //если формат " ****-**-** **:**:** "
	                                dateTypes.date.data.push(Date.parse(valueStore));
	                                dateTypes.date.index.push(i);
                                }else if(valueStore = value.match(config.regExp._time_date)) {
	                                //если формат " **:**:** ****-**-** "
	                                dateTypes.date.data.push(Date.parse(valueStore));      //сохраняем в массиве дату в ms
	                                dateTypes.date.index.push(i);
                                }else if(valueStore = value.match(config.regExp._date)) {
	                                //если формат " ****-**-** "
	                                dateTypes.date.data.push(Date.parse(valueStore));      //сохраняем в массиве дату в ms
	                                dateTypes.date.index.push(i);
                                }else if(valueStore = value.match(config.regExp._time)) {
	                                //если формат " **:**:** "
	                                let elDate = String(valueStore).split(':');
	                                let storDate = elDate[0]*100 + elDate[1]*10 + elDate[2] + Date.now();
	                                dateTypes.date.data.push(storDate);
	                                dateTypes.date.index.push(i);
                                }
			}else if(((valueStore = value.substr(0,8)) == config._ptotocols._https) ||
				((valueStore = value.substr(0,7)) == config._ptotocols._http)) {
				//формирование алфавита Domen
				dateTypes.abc.data.push(value[valueStore.length].toLowerCase());
				dateTypes.abc.index.push(i);
			}else {
				//формирование алфавита строки
				dateTypes.abc.data.push(value[0].toLowerCase());
				dateTypes.abc.index.push(i);
			}
		}
		$.each(arrTr, function(i) {
			let val = $(this).find('td,th').eq(indCell);
			if ($(val).find('input').length > 0){
				//выборка input  - text
				let el_Input = $(val).find('input');
				if (el_Input.filter(':text').length > 0){
					value = el_Input.filter(':text').val().trim();
					genAlp(value,i);
				} else if(el_Input.filter(':hidden').length > 0) {
					++empty;                                        //счетчик пустых ячеек
					dateTypes.space.index.push(i);                     //индекс пустых ячеек
				}else if(el_Input.filter(':checkbox').length > 0) {
					value = el_Input.filter(':checkbox');
					if (value.prop('checked') == true) {
						dateTypes.number.data.push(1);
						dateTypes.number.index.push(i);
					}else {
						++empty;                                 //счетчик пустых ячеек
						dateTypes.space.index.push(i);              //индекс пустых ячеек
					}
				}
			} else if ($(val).find('select').length > 0) {
				//выборка input  - text
				value = $(val).find('select').val().trim();
				genAlp(value,i);
			}else if ($(val).find('textarea').length > 0) {
				//выборка textarea
				value = $(val).find('textarea').val().trim();
				genAlp(value,i);
			}else{
				value = $(val).text();
				genAlp(value,i);
			}
		})
		if (empty == arrTr.length) {
			return true;
		}
		//если столбец не пустой
		//очищаем DOM от предыдущей таблицы
		let tbodyNew = $(id_T).find('tbody').empty();
		let _arr_data_ind = [
			{data: dateTypes.number.data, index: dateTypes.number.index},
			{data: dateTypes.date.data, index: dateTypes.date.index},
			{data: dateTypes.ip.data, index: dateTypes.ip.index},
			{data: dateTypes.abc.data, index: dateTypes.abc.index}
		];
		if (fSort){
			if (dateTypes.space.index.length) {
				//добавление алфавита пустых ячеек
				dateTypes.space.index.forEach(function(item){tbodyNew.append(arrTr[item]);});
			};
			_arr_data_ind.forEach(function(item, i) {
				if(item.data.length > 0)
					tbodyNew.append(trSort(item.data, arrTr, item.index));
			});
		}else {
			_arr_data_ind.forEach(function(item, index)  {
				if(_arr_data_ind[_arr_data_ind.length - index - 1].data.length > 0)
					tbodyNew.append(trSort(_arr_data_ind[_arr_data_ind.length - index - 1].data,
						arrTr,_arr_data_ind[_arr_data_ind.length - index - 1].index));
			});
			if (dateTypes.space.index.length) {
				dateTypes.space.index.forEach(function(item){tbodyNew.append(arrTr[item]);});
			}
		}

		return false;
	}

	if(namesTable.length > 0){
		namesTable.forEach(function(item) {
			//стартовая прорисовка указателей сортировки
			$(item + ' thead').find('.rows').remove();
			$(config._span_block._span_arrow).appendTo($(item + ' thead').find('th, td'));
			//стиль стрелок
			$('.rows').css({'display': 'inline-block'});
			$('.rows span').css({'display':'block',
			                     'font-size': '30%',
			                     'margin-left': '10px',
			                     'color': '#3A8356'
			                    });
		})
	}

	$(namesTable.join(',')).find('th').click(function() {
		let start = Date.now();
        	let _this_table = $(this).parents('table');     //записываем имя ID или CLass сортируемой таблицы

		id_T = (_this_table.attr('id')) ?  ('#' + _this_table.attr('id')) : ('.' + _this_table.attr('class'));

                indCell = $(this).index();

                if (arrNotSortCells.indexOf(indCell) != -1) {
                        return;
                }
                //проверка что  в arrNotSortCells нет indCell
                let notSortFlag = selectData();         //1 - столбец пустой, иначе 0
                        
	        if(notSortFlag) {
		        //проверка индекса столбца на сортировку
		        //добавляем класс tooltip
		        $(this).addClass('tool_tip');
		        $(config._span_block._span_tTip).appendTo($(this));
		        $('.tool_tip').css({'position': 'relative'});
		        $('.tool_tip .tooltiptext').css({ 'visibility': 'visible',
                                                          'font-size': '100%',
                                                          'width': '193px',
                                                          'background-color': '#555',
                                                          'color': '#fff',
                                                          'border-radius': '197px',
                                                          'padding': '5px 0',
                                                          'position': 'absolute',
                                                          'z-index': '1',
                                                          'bottom': '100%',
                                                          'left': '50%',
                                                          'margin-left': '-100px'
                                                         });

                        $('.tool_tip .tooltiptext::after').css({ 'visibility': 'visible',
                                                                 'content': "",
                                                                 'position': 'absolute',
                                                                 'top': '100%',
                                                                 'left': '50%',
                                                                 'margin-left': '-5px',
                                                                 'border-width': '5px',
                                                                 'border-style': 'solid',
                                                                 'border-color': '#555 transparent transparent transparent'
                                                         });
			
		        setTimeout(del_toolTip.bind(this), 1000);
		        $(id_T).find('.up, .down').css('visibility', 'visible');
		        return
	        }
	        //восстанавливаем исходные стрелки и очищаем таблицу от данного id таблицы
	        $(id_T).find('.up, .down').css('visibility', 'visible');

		let _css_not_arrow = (fSort) ? 'hidden' : 'visible';
		$(id_T).find('.down').eq(indCell).css('visibility', _css_not_arrow);
		
		let _css_arrow = (fSort) ? 'visible' : 'hidden';
	        $(id_T).find('.up').eq(indCell).css('visibility', _css_arrow);

	        fSort ^= 1;
		//меняем направление сортировки

		console.log("Время конца сортировки" + " " + (Date.now() - start) + "ms");
        });
}
