import 'css/index/index.css'
import 'css/index.styl'
import _ from 'lodash';
import a from  '../common/index.js'

document.getElementById('index').style.color='#ccc'
let obj = _.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 });
console.log(obj, 'index-obj')
const index = () =>{
	console.log(2)
	a()
}
index()