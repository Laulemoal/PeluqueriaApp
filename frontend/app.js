function onlyNumbers(input) {
    input.value = input.value.replace(/\D/g, "");
}

const API = "http://localhost:3000";

async function loadServices() {
    const res = await fetch(`${API}/services`);
    const data = await res.json();
    const servicesRes = await fetch(`${API}/services/catalog`);
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

// ================= SERVICIOS =================

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

}


async function deleteService(id) {
    const ok = confirm("¿Eliminar este servicio?");
    if (!ok) return;

    await fetch(`${API}/services/${id}`, {
        method: "DELETE"
    });


}




// ================= CLIENTES =================

async function loadClients() {
    const res = await fetch(`${API}/clients`);
    const data = await res.json();
    console.log("loadClients render ->", data);


    const ul = document.getElementById("clients");
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


async function deleteClient(id) {
    const ok = confirm("¿Eliminar este cliente?");
    if (!ok) return;

    const res = await fetch(`${API}/clients/${id}`, { method: "DELETE" });

    if (!res.ok) {
        console.error("DELETE /clients falló:", res.status);
        return alert(`No se pudo eliminar (HTTP ${res.status})`);
    }

}


async function addClient() {
    const nameEl = document.getElementById("clientName");
    const phoneEl = document.getElementById("clientPhone");

    const name = nameEl.value.trim();
    const phone = phoneEl.value.trim();

    if (!name) return alert("Nombre requerido");

    if (phone && !/^\d+$/.test(phone)) {
        return alert("El teléfono solo puede contener números");
    }

    try {
        const res = await fetch(`${API}/clients`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone })
        });

        if (!res.ok) {
            const txt = await res.text().catch(() => "");
            console.error("POST /clients falló:", res.status, txt);
            return alert(`No se pudo guardar el cliente (HTTP ${res.status})`);
        }

        // Limpiar inputs
        nameEl.value = "";
        phoneEl.value = "";


    } catch (err) {
        console.error("Error de red al crear cliente:", err);
        alert("Error de red: ¿está corriendo el backend?");
    }
}




// ================= TURNOS =================

async function loadAppointments() {
    const res = await fetch(`${API}/appointments`);
    const data = await res.json();

    const ul = document.getElementById("appointments");
    ul.innerHTML = "";

    data.forEach(a => {
        const li = document.createElement("li");
        li.textContent = `${a.date} ${a.time} - ${a.client} (${a.service})`;
        ul.appendChild(li);
    });
}

async function loadClientsAndServicesForAppointments() {
    const clientsRes = await fetch(`${API}/clients`);
    const clients = await clientsRes.json();

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


async function addAppointment() {
    const client_id = document.getElementById("appointmentClient").value;
    const service_id = document.getElementById("appointmentServiceId").value;
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;

    if (!client_id) return alert("Elegí un cliente");
    if (!service_id) return alert("Elegí un servicio");
    if (!date || !time) return alert("Fecha y hora requeridas");

    const res = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id, service_id: Number(service_id), date, time })
    });

    if (!res.ok) return alert("No se pudo guardar el turno");

    // limpiar selección de servicio
    document.getElementById("appointmentServiceId").value = "";
    const box = document.getElementById("servicesCatalog");
    if (box) box.querySelectorAll(".service-card").forEach(x => x.classList.remove("active"));

    await loadAppointments();
}




let servicesCache = [];

async function loadServicesForCatalogAndSelect() {
    servicesCache = await res.json();
    renderServicesCatalog();
}


function renderServicesCatalog() {
    const box = document.getElementById("servicesCatalog");
    const hidden = document.getElementById("appointmentServiceId");

    if (!box) {
        console.error("No existe #servicesCatalog en el HTML");
        return;
    }
    if (!hidden) {
        console.error("No existe #appointmentServiceId (hidden) en el HTML");
        return;
    }

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



serviceSelect.onchange = () => renderServicesCatalog();



document.addEventListener("DOMContentLoaded", async () => {


    // Precio (Servicios)
    const priceInput = document.getElementById("servicePrice");
    if (priceInput) {
        priceInput.addEventListener("input", (e) => onlyNumbers(e.target));
    }

    // Teléfono (Clientes)
    const phoneInput = document.getElementById("clientPhone");
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => onlyNumbers(e.target));
    }

    console.log("DOM cargado");
    await loadServices();
    await loadClients();
    await loadAppointments();
    await loadClientsAndServicesForAppointments();
    await loadServicesForCatalogAndSelect();
});

