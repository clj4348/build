import 'css/index/index.css'
import 'css/index.styl'
import a from  '../common/index.js'
window.onload = () => {
	document.getElementById('index').style.color='red'
	const index = () =>{
		console.log(2)
		a()
	}
	index()
}