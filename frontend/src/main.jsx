import 'bootstrap/dist/css/bootstrap.min.css';
import  ReactDom  from 'react-dom/client'
import App from './App.jsx';
import Navbar from './components/Navbar.jsx';
import store from './redux/store/store.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import NotificationListener from './pages/NotificationListener.jsx';



const root = ReactDom.createRoot(document.getElementById('root'));
//store se jo aa raha hai usse yaha subscribe kar rhe hain
store.subscribe(()=>{
  store.getState();
})

root.render(
    /* provider k ander jisme bhi humhe  reducer wali chizo ka use karn hai, provider k and us wale componet ko bhej denge*/
    <Provider store={store}>
      <BrowserRouter>
        <Navbar/>
        <App/>
      </BrowserRouter>
    </Provider>
)
