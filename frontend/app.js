const API = "http://localhost:3000";

function onlyNumbers(input) {
    input.value = input.value.replace(/\D/g, "");
}


async function loadServices() {
    const res = await fetch(`${API}/services`); 
    const data = await res.json();

    const ul = document.getElementById("services");
    if (!ul) return;
    ul.innerHTML = "";

    data.forEach(s => {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = `${s.name} - $${s.price}`;

        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.style.marginLeft = "10px";
        btn.className = "danger";
        btn.onclick = () => deleteService(s.id);

        li.appendChild(text);
        li.appendChild(btn);
        ul.appendChild(li);
    });
}

async function addService() {
    const nameEl = document.getElementById("serviceName");
    const priceEl = document.getElementById("servicePrice");

    const name = nameEl.value.trim();
    const price = priceEl.value.trim();

    if (!name) return alert("Nombre del servicio requerido");
    if (!price || Number(price) < 0) return alert("Precio válido requerido");

    const res = await fetch(`${API}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price) })
    });

    if (!res.ok) return alert("No se pudo guardar el servicio");

    nameEl.value = "";
    priceEl.value = "";

    await loadServices();         
    await loadServicesCatalog();  
}

async function deleteService(id) {
    const ok = confirm("¿Eliminar este servicio?");
    if (!ok) return;

    const res = await fetch(`${API}/services/${id}`, { method: "DELETE" });
    if (!res.ok) return alert("No se pudo eliminar");

    await loadServices();
    await loadServicesCatalog();
}


async function loadClients() {
    const res = await fetch(`${API}/clients`);
    const data = await res.json();

    const ul = document.getElementById("clients");
    if (!ul) return;
    ul.innerHTML = "";

    data.forEach(c => {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = `${c.name} (${c.phone || "sin tel"})`;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Eliminar";
        btn.className = "danger";
        btn.onclick = () => deleteClient(c.id);

        li.appendChild(text);
        li.appendChild(btn);
        ul.appendChild(li);
    });
}

async function addClient() {
    const nameEl = document.getElementById("clientName");
    const phoneEl = document.getElementById("clientPhone");

    const name = nameEl.value.trim();
    const phone = phoneEl.value.trim();

    if (!name) return alert("Nombre requerido");
    if (phone && !/^\d+$/.test(phone)) return alert("El teléfono solo puede contener números");

    const res = await fetch(`${API}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone })
    });

    if (!res.ok) return alert("No se pudo guardar el cliente");

    nameEl.value = "";
    phoneEl.value = "";

    await loadClients();
    await loadClientsForAppointments();
}

async function deleteClient(id) {
    const ok = confirm("¿Eliminar este cliente?");
    if (!ok) return;

    const res = await fetch(`${API}/clients/${id}`, { method: "DELETE" });
    if (!res.ok) return alert("No se pudo eliminar");

    await loadClients();
    await loadClientsForAppointments();
}


async function loadClientsForAppointments() {
    const res = await fetch(`${API}/clients`);
    const clients = await res.json();

    const clientSelect = document.getElementById("appointmentClient");
    if (!clientSelect) return;

    clientSelect.innerHTML = "";
    clients.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.name;
        clientSelect.appendChild(option);
    });
}

async function loadAppointments() {
    const res = await fetch(`${API}/appointments`);
    const data = await res.json();

    const ul = document.getElementById("appointments");
    if (!ul) return;
    ul.innerHTML = "";

    data.forEach(a => {
        const li = document.createElement("li");
        li.textContent = `${a.date} ${a.time} - ${a.client} (${a.service})`;
        ul.appendChild(li);
    });
}

async function addAppointment() {
    const client_id = document.getElementById("appointmentClient").value;
    const service_id = document.getElementById("appointmentServiceId").value;
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;

    if (!client_id) return alert("Elegí un cliente");
    if (!service_id) return alert("Elegí un servicio de 'Servicios disponibles'");
    if (!date || !time) return alert("Fecha y hora requeridas");

    const res = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id, service_id: Number(service_id), date, time })
    });

    if (!res.ok) return alert("No se pudo guardar el turno");

    document.getElementById("appointmentServiceId").value = "";
    const box = document.getElementById("servicesCatalog");
    if (box) box.querySelectorAll(".service-card").forEach(x => x.classList.remove("active"));

    await loadAppointments();
}


let servicesCache = [];

async function loadServicesCatalog() {
    const res = await fetch(`${API}/services/catalog`); 
    servicesCache = await res.json();
    renderServicesCatalog();
}

function renderServicesCatalog() {
    const box = document.getElementById("servicesCatalog");
    const hidden = document.getElementById("appointmentServiceId");
    if (!box || !hidden) return;

    box.innerHTML = "";

    servicesCache.forEach(s => {
        const card = document.createElement("div");
        card.className = "service-card";
        card.innerHTML = `
      <div class="name">${s.name}</div>
      <div class="price">$${s.price}</div>
    `;

        card.onclick = () => {
            hidden.value = String(s.id);
            box.querySelectorAll(".service-card").forEach(x => x.classList.remove("active"));
            card.classList.add("active");
        };

        box.appendChild(card);
    });
}


document.addEventListener("DOMContentLoaded", async () => {
    // Solo números
    const priceInput = document.getElementById("servicePrice");
    if (priceInput) priceInput.addEventListener("input", (e) => onlyNumbers(e.target));

    const phoneInput = document.getElementById("clientPhone");
    if (phoneInput) phoneInput.addEventListener("input", (e) => onlyNumbers(e.target));

    // Cargas iniciales
    await loadServices();
    await loadClients();
    await loadClientsForAppointments();
    await loadServicesCatalog();
    await loadAppointments();
});
