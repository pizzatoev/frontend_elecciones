const cards = [
  {
    id: 1,
    title: "Veedores",
    subtitle: "Vigilancia",
    img: "/veedor.jpg",
    link: "https://www.youtube.com/watch?v=2c8L-rzoiFA",
    modalTitle: "Veedores Electorales",
    modalIntro:
      "Capacitación para veedores en la segunda vuelta de las elecciones 2025 en Bolivia.",
    modalContent:
      "Los veedores tienen la responsabilidad de supervisar que los procesos electorales se realicen de manera transparente y conforme a la normativa vigente. Durante esta capacitación, aprenderás sobre tus derechos y deberes, cómo reportar irregularidades y cómo garantizar la integridad del voto.",
    hoverClass: "card-hover-red",
  },
  {
    id: 2,
    title: "Jurados",
    subtitle: "Evaluación",
    img: "/jurado.jpg",
    link: "https://www.youtube.com/watch?v=uIEpBGLM7Tk",
    modalTitle: "Jurados Electorales",
    modalIntro:
      "Capacitación práctica para jurados electorales en la segunda vuelta de Bolivia 2025.",
    modalContent:
      "Los jurados electorales son responsables de la correcta instalación de las mesas de votación, supervisión del sufragio y conteo de votos. En esta formación conocerás los procedimientos a seguir, manejo de material electoral y cómo garantizar que cada voto sea válido y seguro.",
    hoverClass: "card-hover-green",
  },
  {
    id: 3,
    title: "Observador",
    subtitle: "Supervisión",
    img: "/observador.jpg",
    link: "https://www.youtube.com/watch?v=uoq99OzcW5M",
    modalTitle: "Observadores Electorales",
    modalIntro:
      "Capacitación para observadores nacionales e internacionales en las elecciones 2025.",
    modalContent:
      "Los observadores tienen la misión de evaluar y reportar la integridad y transparencia de los procesos electorales. Esta capacitación te brindará herramientas para monitorear el desarrollo de la votación, identificar posibles irregularidades y elaborar informes objetivos sobre la jornada electoral.",
    hoverClass: "card-hover-yellow",
  },
];

export default function Content() {
  return (
    <main className="w-100 h-auto bg-bolivia py-5">
        
      <div className="container">
        <div className="row justify-content-center">
          {cards.map((card) => (
            <div key={card.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card-item">
                <a
                  className="card-link"
                  data-bs-toggle="modal"
                  href={`#cardModal${card.id}`}
                >
                  <div className={`card-hover ${card.hoverClass}`}>
                    <div className="card-hover-content">
                      <i className="fas fa-plus fa-3x"></i>
                    </div>
                  </div>
                  <img className="img-fluid" src={card.img} alt={card.title} />
                </a>
                <div className="card-caption">
                  <div className="card-caption-heading">{card.title}</div>
                  <div className="card-caption-subheading text-muted">
                    {card.subtitle}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cards.map((card) => (
        <div
          key={card.id}
          className="card-modal modal fade"
          id={`cardModal${card.id}`}
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="modal-body">
                      <h2 className="text-uppercase">{card.modalTitle}</h2>
                      <p className="item-intro text-muted">{card.modalIntro}</p>
                      <p>{card.modalContent}</p>
                      <button
                        className="btn btn-primary btn-xl text-uppercase"
                        data-bs-dismiss="modal"
                        type="button"
                      >
                        Cerrar
                      </button>

                      <button
                        className="btn btn-primary btn-xl text-uppercase ms-3"
                        data-bs-dismiss="modal"
                        type="button"
                        onClick={() => window.open(card.link, "_blank")}
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
