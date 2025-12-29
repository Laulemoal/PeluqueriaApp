const API = "http://localhost:3000";

async function loadServices() {
    const res = await fetch(`${API}/services`);
    const data = await res.json();

    const ul = document.getElementById("services");
    ul.innerHTML = "";

    data.forEach(s => {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = `${s.name} - $${s.price}`;

        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.style.marginLeft = "10px";
        btn.onclick = () => deleteService(s.id);

        li.appendChild(text);
        li.appendChild(btn);
        ul.appendChild(li);
    });
}

async function addService() {
    const name = document.getElementById("serviceName").value;
    const price = document.getElementById("servicePrice").value;

    await fetch(`${API}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price })
    });

    loadServices();
}

async function deleteService(id) {
    const ok = confirm("¿Eliminar este servicio?");
    if (!ok) return;

    await fetch(`${API}/services/${id}`, {
        method: "DELETE"
    });

    loadServices();
}


loadServices();
