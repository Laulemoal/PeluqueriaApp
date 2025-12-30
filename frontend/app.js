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

// ================= CLIENTES =================

async function loadClients() {
    const res = await fetch(`${API}/clients`);
    const data = await res.json();

    const ul = document.getElementById("clients");
    ul.innerHTML = "";

    data.forEach(c => {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = `${c.name} (${c.phone || "sin tel"})`;

        const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.style.marginLeft = "10px";
        btn.onclick = () => deleteClient(c.id);

        li.appendChild(text);
        li.appendChild(btn);
        ul.appendChild(li);
    });
}

async function addClient() {
    const name = document.getElementById("clientName").value;
    const phone = document.getElementById("clientPhone").value;

    if (!name) return alert("Nombre requerido");

    await fetch(`${API}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone })
    });
    }
    
    document.getElementById("clientName").value = "";
    document.getElementById("clientPhone").value = "";

    loadClients();

    async function deleteClient(id) {
        const ok = confirm("¿Eliminar este cliente?");
        if (!ok) return;

        await fetch(`${API}/clients/${id}`, {
            method: "DELETE"
        });

        loadClients();

    }

    loadClients();

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
        const servicesRes = await fetch(`${API}/services`);

        const clients = await clientsRes.json();
        const services = await servicesRes.json();

        const clientSelect = document.getElementById("appointmentClient");
        const serviceSelect = document.getElementById("appointmentService");

        clientSelect.innerHTML = "";
        serviceSelect.innerHTML = "";

        clients.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;
            option.textContent = c.name;
            clientSelect.appendChild(option);
        });

        services.forEach(s => {
            const option = document.createElement("option");
            option.value = s.id;
            option.textContent = s.name;
            serviceSelect.appendChild(option);
        });
    }

    async function addAppointment() {
        const client_id = document.getElementById("appointmentClient").value;
        const service_id = document.getElementById("appointmentService").value;
        const date = document.getElementById("appointmentDate").value;
        const time = document.getElementById("appointmentTime").value;

        if (!date || !time) return alert("Fecha y hora requeridas");

        await fetch(`${API}/appointments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_id, service_id, date, time })
        });

        loadAppointments();
    }

    loadAppointments();
    loadClientsAndServicesForAppointments();
