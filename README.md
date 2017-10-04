Многофункциональная сортировка
======

Краткое описание назначение multi_s_table.js 
--------
multi_s_table.js представляет собой алгоритм сортировки таблиц с различными данными и структорой DOM. Главной функцией 
является *SortTable(id_table, arrNotSortCells)*.

Фкнкция сортировки работает со следующими типами данных:
--------
* `числовые данные: int, float`
* `строковые данные, сортировка выполняет по первому симвлу строки`
* `Домены: http, https`
* `дату в формате: дд-мм-гг чч:мм:сс`
* `дату в формате: чч:мм:сс`
* `дату в формате: дд-мм-гг`
* `IP адреса по всем разрядам`

Функция сортировки способна обрабатывать данные расположенных в следующих формах:
--------
* `тег  <input>`
  * `тег  <hidden>`  
  * `тег  <checkbox>`
  * `тег  <text>`
* `тег  <textarea>`
* `тег  <select>`
* `множество включенных друг в друга тегов <p>, <h> и т.п.`


Описание multi_s_table.js 
--------

Функция *SortTable(id_table, arrNotSortCells)* принимает на вход массив id's сортируемых таблиц,
массив номеров столбцов, для которых сортировка запрещена.
На начальном этапе выполняется поиск заголовков *TH*, относительно найденных элементов выполняется 
прорисовка стрелок. 
![Стрелка сортировки](https://github.com/ragandel/multi_s_table-/tree/master/img/IUXNYfOr-QQ.jpg)

Описание crtTable.js 
--------
crtTable.js  генератор таблиц для выполнений тестов.
