import React, {useState, useEffect} from 'react';
import Sbar from './components/Sbar.js';

const App = () => {
  //Hook para actulizacion y carga de articulos NOTICIAS
  const [articles, setArticles] = useState ([]);

  //Hook para busqueda en la barra de busqueda
  const [topic, setTopic] = useState ('Bogota');

  //Hook para cancelar la recarga de la pagina
  const [isLoading, setIsLoading] = useState(true);

  //Hook para actualizacion y carga de estado de CLIMA
  const [weather, setWeather] = useState('');

  //11 Hook para historial
  const [history, setHistory] = useState ([]);

  //Funcion useEffect fetch clima y articulos
  useEffect(()=>{

    //fetch para actualizar articulos
    const fetchArticles = async () =>{
      try{
        const res = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${topic}&api-key=c0Kmt4iRCyymAV7UMW0XC43anvNBTrK9`)
        const articles = await res.json()
        //verificacion por consola de get docs
        console.log(articles.response.docs)
        //asignacion de json a la matriz de articulos
        setArticles(articles.response.docs)
        setIsLoading(false)
      } catch(error){
        console.error(error)
      }
    }

    const fetchWeather = async () =>{
      try{
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${topic}&units=metric&APPID=fb18506fbb9d71486e20b6915e7d598c`)
        //Funcion arrow para asignacion de json 
        .then(ans => ans.json())
        .then(result => {
          setWeather(result);
          console.log(result);
        });

      } catch(error){
        console.error(error)
      }
    }

    const fetchHistory = async () =>{
      try{
        fetch(`http://localhost:44963/api/History`)
        //Funcion arrow para asignacion de json 
        .then(ret => ret.json())
        .then(data => {
          setHistory(data);
        });

      } catch(error){
        console.error(error)
      }
    }

    const AddHistory = async () =>{
      fetch(`http://localhost:44963/api/History`,{
        method:'POST',
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          city:topic
        })
      })
      .then(r => r.json())
      .then((rresult)=>{
        console.log("genial")
      })
    }

    //instancia de los metodos fetch-----------------------------------------------------------------------------------------------------------------------------
    AddHistory();
    fetchHistory();
    fetchWeather();
    fetchArticles();
  }, [topic]);

  //Metodo constructor de fecha apartir de retorno de metodos date
  const dateBuilder = (datte) => {
    let months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Nomviembre","Diciembre"];
    let days = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];

    let day = days[datte.getDay()];
    let date = datte.getDate();
    let month = months[datte.getMonth()];
    let year = datte.getFullYear();

    return `${day} ${date} ${month} de ${year}`
  }

  return (
    <>
      <div className="showcase">
        <div className="overlay px-5">
          <h1 className="text-5xl font-bold text-white text-center mb-4 ">!Bienvenido a Today! </h1>
          <h1 className="text-2xl font-bold text-white text-center mb-4">Busca alguna ciudad ahora mismo </h1>
          <Sbar Stext={(text) => setTopic(text)}/>
        </div>
      </div>

      

      {(typeof weather.main != "undefined") ? (
          <div>
            {/*Nombre Ciudad*/}
            <div className="showcaseTimeInformation">
              <h1 className="text-4xl font-bold text-white text-center mb-4 capitalize">{weather.name} </h1>
              {/*Temperatura*/}
              <div>
                <h1 className="text-7xl font-bold text-white text-center mb-4 ">
                  {Math.round(weather.main.temp)}°c
                </h1>
              </div>

              {/*Estado de clima*/}
              <div>
                <h1 className="text-4xl font-bold text-white text-center mb-4 ">
                  {weather.weather[0].main}
                </h1>
              </div>

              {/*Fecha ciudad*/}
              <div className="text-white">{dateBuilder(new Date())} </div>
              
            </div>
          </div>
        ) : ('Realiza una busqueda :D')}

      {isLoading ? (<h1 className="text-center mt-20 font-bold text-6xl text-white">Cargando...</h1>) :(
        <section className="grid grid-cols-1 gap-10 px-5 pt-10 pb-20">
        <h1 className="text-4xl font-bold text-white text-center mb-4">Lo ultimo en  {weather.name}</h1>
        {articles.map((article) =>{
          const {headline:{main}, abstract, web_url, lead_paragraph,_id,byline:{original}}=article;

          return(
            <article key={_id} className="bg-white py-10 px-5 rounded-lg lg:w-9/12 lg:mx-auto">
              <h2 className="font-bold text-2xl mb-2">{main}</h2>
              <p>{original}</p>
              <p>{abstract}</p>
              <p>{lead_paragraph}</p>
              <a href={web_url} target="_blank" className="underline" >Sacado de la fuente</a>
            </article>
          )
        })}
      </section>
      )}

      <div className="showcaseTimeInformation">
        <thead>
          <h1 className="text-2xl font-bold text-white text-center mb-4 ">Historial </h1>
        </thead>
        <tbody>
          {history.map(h =>
            <tr key={h.searchId}>
                <td className="text-white">{h.city}</td>
            </tr>)}
        </tbody>
      </div>
    </>

  );
}

export default App;