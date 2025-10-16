const imgs = [
  {
    img: `${window.location.origin}/1.jpg`,
  },
  {
    img: `${window.location.origin}/2.jpg`,
  },
  {
    img: `${window.location.origin}/3.jpg`,
  },
  {
    img: `${window.location.origin}/4.jpg`,
  },
];
export default function Section() {
  return (
    <>
      <section className="position-relative w-100 h-80">
        <div
          className="carousel slide position-absolute w-100 h-100 z-n1"
          data-bs-ride="carousel"
          data-bs-interval="5000"
        >
          <div className="carousel-inner w-100 h-100">
            {imgs.map((img, index) => (
              <div
                key={index}
                className={`carousel-item ${
                  index === 0 ? "active" : ""
                } w-100 h-100`}
              >
                <img
                  src={img.img}
                  className="w-100 h-100"
                  style={{ objectFit: "cover", filter: "blur(3px)" }}
                  alt="..."
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
          <h5 className="fst-italic text-white">
            "Por una elección transparente y justa."
          </h5>
          <h1 className="fs-title text-white">ACADEMIA</h1>
        </div>
      </section>
    </>
  );
}
