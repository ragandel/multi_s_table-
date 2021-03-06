Многофункциональная сортировка
======

Краткое описание назначение multi_s_table.js 
--------
multi_s_table.js представляет собой алгоритм сортировки таблиц HTML по остолбцам с различными данными и структорой DOM. 
Сортировка таблиц выполняется функцией *SortTable(id_table, arrNotSortCells)*. Функции передается массив id's 
сортируемых таблиц и массив номеров столбцов, для которых сортировка запрещена. Внутри функции имеется переменная 
*nameClass* -  класс сортируемой таблицы HTML. 

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


Принцип работы
--------
1. Выполняется поиск таблиц с id входящие в массив *id_table* и таблиц с классами указанные в *nameClass*
2. Выполняется прорисовка стрелок для управление сортировкой таблицы
3. Определение формата тегов и данных в сортируемом столбце таблицы. 
4. Сортировка строк таблицы на основе собранных данных в п3.

![Внешний вид](https://github.com/ragandel/multi_s_table-/raw/master/img/Ex1.png)
