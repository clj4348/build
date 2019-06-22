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
if (module.hot) {
		console.log('sdfqwwr,90')
	    // 通知 webpack 该模块接受 hmr
	    module.hot.accept(err => {
	        if (err) {
	            console.error('Cannot apply HMR update.', err);
	        }
	    });
	}
