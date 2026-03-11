const SUPABASE_URL = "https://vwzxirmphsnwflphiaog.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_6unNpRC4hYQGpNvQgXO7NA_AmJnDTz5";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: window.localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

let artigos = []

async function carregarArtigos() {

  const { data, error } = await supabaseClient
    .from("artigos")
    .select("titulo,resumo,url,data_publicacao")
    .order("data_publicacao", { ascending:false })
    .limit(20)

  if(error){

    console.error(error)

    return
  }

  artigos = data

  renderizar()

}

function renderizar() {

  const destaque = artigos[0]

  const resto = artigos.slice(1)

  renderHero(destaque)

  renderLista(resto)

}

function renderHero(a){

  const container = document.getElementById("artigo-destaque")

  const dataFormatada = new Date(a.data_publicacao)
  .toLocaleDateString("pt-BR")

  container.innerHTML = `

  <div class="hero-artigo">

    <small>${dataFormatada}</small>

    <h2>${a.titulo}</h2>

    <p>${a.resumo ?? ""}</p>

    <a href="${a.url}"
       target="_blank"
       class="btn-artigo">

       Ler no Substack

    </a>

  </div>

  `
}

function renderLista(lista){

  const container = document.getElementById("lista-artigos")

  container.innerHTML = ""

  lista.forEach(a => {

    const dataFormatada = new Date(a.data_publicacao)
    .toLocaleDateString("pt-BR")

    const card = `

    <div class="col-md-6 col-lg-4 mb-4">

      <div class="card h-100">

        <small>${dataFormatada}</small>

        <h5>${a.titulo}</h5>

        <p>${a.resumo ?? ""}</p>

        <a href="${a.url}"
           target="_blank"
           class="btn-artigo">

           Ler

        </a>

      </div>

    </div>

    `

    container.innerHTML += card

  })

}


/* BUSCA */

document.getElementById("busca")
.addEventListener("input", (e)=>{

  const termo = e.target.value.toLowerCase()

  const filtrados = artigos.filter(a =>
    a.titulo.toLowerCase().includes(termo)
  )

  renderLista(filtrados)

})


carregarArtigos()