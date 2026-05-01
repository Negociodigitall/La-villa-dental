/* =============================================
   CLÍNICA LA VILLA DENTAL - SCRIPT.JS
   ============================================= */

'use strict';

/* ===== CONFIGURACIÓN ===== */
const CONFIG = {
    telefono: '83106890',
    whatsapp: '50683106890',
    duracionContador: 2000,
    duracionToast: 4000,
    umbralScroll: 100
};

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Scroll navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > CONFIG.umbralScroll) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    actualizarBackTop();
    actualizarNavActivo();
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
    const estaAbierto = navMenu.classList.contains('abierto');

    if (estaAbierto) {
        hamburger.classList.remove('activo');
        navMenu.classList.remove('abierto');
        document.body.style.overflow = '';
    } else {
        hamburger.classList.add('activo');
        navMenu.classList.add('abierto');
        document.body.style.overflow = 'hidden';
    }
});

// Cerrar menú al hacer click en links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            cerrarMenu();
            const target = document.querySelector(href);
            if (target) {
                setTimeout(() => {
                    scrollSuave(target);
                }, 300);
            }
        }
    });
});

// También cerrar al tocar fuera en móvil
document.addEventListener('touchstart', (e) => {
    if (navMenu.classList.contains('abierto') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
        cerrarMenu();
    }
});

// Cerrar menú al hacer click fuera
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('abierto') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
        cerrarMenu();
    }
});

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarMenu();
});

function cerrarMenu() {
    hamburger.classList.remove('activo');
    navMenu.classList.remove('abierto');
    document.body.style.overflow = '';
    console.log('Menú cerrado');
}

// Actualizar link activo en navbar
function actualizarNavActivo() {
    const secciones = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;

    secciones.forEach(seccion => {
        const top = seccion.offsetTop - 100;
        const altura = seccion.offsetHeight;
        const id = seccion.getAttribute('id');

        if (scrollY >= top && scrollY < top + altura) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* ===== SCROLL SUAVE ===== */
function scrollSuave(elemento, offset = 80) {
    const posicion = elemento.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: posicion, behavior: 'smooth' });
}

// Todos los links con href="#..."
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        scrollSuave(target);
    });
});

/* ===== CONTADORES ANIMADOS ===== */
let contadoresAnimados = false;

function animarContador(elemento) {
    const objetivo = parseInt(elemento.dataset.target);
    const duracion = CONFIG.duracionContador;
    const inicio = performance.now();

    function easeOut(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function actualizar(ahora) {
        const transcurrido = ahora - inicio;
        const progreso = Math.min(transcurrido / duracion, 1);
        const valor = Math.round(objetivo * easeOut(progreso));
        elemento.textContent = valor.toLocaleString('es-CR');

        if (progreso < 1) {
            requestAnimationFrame(actualizar);
        } else {
            elemento.textContent = objetivo.toLocaleString('es-CR');
        }
    }

    requestAnimationFrame(actualizar);
}

function verificarContadores() {
    if (contadoresAnimados) return;

    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
        contadoresAnimados = true;
        document.querySelectorAll('.stat-num[data-target]').forEach((el, i) => {
            setTimeout(() => animarContador(el), i * 150);
        });
    }
}

window.addEventListener('scroll', verificarContadores);
verificarContadores();

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-item').forEach(item => {
    const pregunta = item.querySelector('.faq-pregunta');
    const respuesta = item.querySelector('.faq-respuesta');

    pregunta.addEventListener('click', () => {
        const estaAbierto = item.classList.contains('abierto');

        // Cerrar todos
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('abierto');
            i.querySelector('.faq-respuesta').classList.remove('visible');
        });

        // Abrir el clickeado si estaba cerrado
        if (!estaAbierto) {
            item.classList.add('abierto');
            respuesta.classList.add('visible');
        }
    });
});

/* ===== FORMULARIO ===== */
const citaForm = document.getElementById('citaForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

// Fecha mínima = hoy
const fechaInput = document.getElementById('fecha');
if (fechaInput) {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    fechaInput.min = `${año}-${mes}-${dia}`;
}

// Formatear teléfono
const telefonoInput = document.getElementById('telefono');
if (telefonoInput) {
    telefonoInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 4) {
            valor = valor.slice(0, 4) + '-' + valor.slice(4, 8);
        }
        e.target.value = valor;
    });
}

// Validar campo individual
function validarCampo(id) {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(id + 'Error');
    if (!input) return true;

    const valor = input.value.trim();
    let valido = true;
    let mensaje = '';

    if (id === 'nombre' || id === 'apellido') {
        if (!valor) {
            valido = false;
            mensaje = 'Este campo es requerido';
        } else if (valor.length < 2) {
            valido = false;
            mensaje = 'Mínimo 2 caracteres';
        } else if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/.test(valor)) {
            valido = false;
            mensaje = 'Solo se permiten letras';
        }
    }

    if (id === 'telefono') {
        const limpio = valor.replace(/[\s\-]/g, '');
        if (!valor) {
            valido = false;
            mensaje = 'El teléfono es requerido';
        } else if (!/^[2-9]\d{7}$/.test(limpio)) {
            valido = false;
            mensaje = 'Ingresa un teléfono válido (ej: 8888-8888)';
        }
    }

    if (id === 'servicio') {
        if (!valor) {
            valido = false;
            mensaje = 'Por favor selecciona un servicio';
        }
    }

    if (!valido) {
        input.classList.add('error');
        if (errorEl) {
            errorEl.textContent = mensaje;
            errorEl.classList.add('visible');
        }
    } else {
        input.classList.remove('error');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
    }

    return valido;
}

// Validación en tiempo real
['nombre', 'apellido', 'telefono', 'servicio'].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener('blur', () => validarCampo(id));
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            validarCampo(id);
        }
    });
});

if (citaForm) {
    citaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const camposRequeridos = ['nombre', 'apellido', 'telefono', 'servicio'];
        let todoValido = true;

        camposRequeridos.forEach(id => {
            if (!validarCampo(id)) todoValido = false;
        });

        const terminos = document.getElementById('terminos');
        if (terminos && !terminos.checked) {
            todoValido = false;
            mostrarToast('warning', 'Aviso', 'Debes aceptar que te contactemos para confirmar tu cita.');
            return;
        }

        if (!todoValido) return;

        // Obtener datos del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const email = document.getElementById('email').value.trim();
        const servicioEl = document.getElementById('servicio');
        const servicioTexto = servicioEl.options[servicioEl.selectedIndex]?.text || '';
        const fecha = document.getElementById('fecha').value || '';
        const hora = document.getElementById('hora').value || '';
        const mensajePaciente = document.getElementById('mensaje').value.trim();

        // Estado de carga
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Preparando mensaje...';

        await new Promise(resolve => setTimeout(resolve, 1200));

        // Construir mensaje para WhatsApp
        let mensajeWa = '';
        mensajeWa += `🦷 *SOLICITUD DE CITA*\n`;
        mensajeWa += `_Clínica La Villa Dental_\n`;
        mensajeWa += `━━━━━━━━━━━━━━━━━━\n\n`;
        mensajeWa += `👤 *Nombre:* ${nombre} ${apellido}\n`;
        mensajeWa += `📞 *Teléfono:* ${telefono}\n`;
        if (email) mensajeWa += `📧 *Correo:* ${email}\n`;
        mensajeWa += `\n🦷 *Servicio:* ${servicioTexto}\n`;
        if (fecha) {
            const fechaObj = new Date(fecha + 'T00:00:00');
            const fechaFormateada = fechaObj.toLocaleDateString('es-CR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            mensajeWa += `📅 *Fecha preferida:* ${fechaFormateada}\n`;
        }
        if (hora) mensajeWa += `🕐 *Hora preferida:* ${hora}\n`;
        if (mensajePaciente) mensajeWa += `\n💬 *Mensaje:* ${mensajePaciente}\n`;
        mensajeWa += `\n━━━━━━━━━━━━━━━━━━\n`;
        mensajeWa += `✅ Por favor confirmar disponibilidad. ¡Gracias! 😊`;

        // URL de WhatsApp
        const urlWhatsApp = `https://wa.me/50683106890?text=${encodeURIComponent(mensajeWa)}`;

        // Resetear formulario
        submitBtn.disabled = false;
        submitBtn.textContent = '📅 Solicitar Cita Ahora';
        citaForm.reset();

        // Mostrar éxito
        formSuccess.classList.add('visible');
        formSuccess.textContent = '✅ ¡Listo! Abriendo WhatsApp con tu solicitud...';

        mostrarToast('success', '¡Solicitud Lista!', `Abriendo WhatsApp con tus datos ${nombre}...`);

        // Guardar en localStorage
        localStorage.setItem('ultimaCita', JSON.stringify({
            nombre: `${nombre} ${apellido}`,
            servicio: servicioTexto,
            fecha,
            hora,
            timestamp: new Date().toLocaleString('es-CR')
        }));

        // Abrir WhatsApp
        setTimeout(() => {
            window.open(urlWhatsApp, '_blank');
        }, 1500);

        // Ocultar mensaje éxito
        setTimeout(() => {
            formSuccess.classList.remove('visible');
        }, 7000);
    });
}

        // Abrir WhatsApp después de un momento
        setTimeout(() => {
            window.open(urlWhatsApp, '_blank');
        }, 1500);

        // Ocultar mensaje de éxito después de 6 segundos
        setTimeout(() => {
            formSuccess.classList.remove('visible');
        }, 6000);
    


        const nombre = document.getElementById('nombre').value || 'Paciente';
        mostrarToast('success', '¡Cita Solicitada!', `Gracias ${nombre}, te contactaremos pronto.`);

        // Ocultar mensaje de éxito después de 6 segundos
        setTimeout(() => {
            formSuccess.classList.remove('visible');
        }, 6000);

        // Construir link de WhatsApp con los datos
        const servicio = document.getElementById('servicio');
        const servicioTexto = servicio.options[servicio.selectedIndex]?.text || '';
        const fecha = document.getElementById('fecha').value || '';
        const hora = document.getElementById('hora').value || '';
        const telefono = document.getElementById('telefono').value || '';

        const mensaje = encodeURIComponent(
            `Hola, soy ${nombre}. Acabo de solicitar una cita para ${servicioTexto}` +
            (fecha ? ` el ${fecha}` : '') +
            (hora ? ` a las ${hora}` : '') +
            `. Mi teléfono es ${telefono}. ¿Pueden confirmarme la cita?`
        );

        // Guardar en localStorage
        localStorage.setItem('ultimaCita', JSON.stringify({
            nombre,
            servicio: servicioTexto,
            fecha,
            hora,
            timestamp: new Date().toLocaleString('es-CR')
        }));



/* ===== TOAST NOTIFICATIONS ===== */
function mostrarToast(tipo, titulo, mensaje) {
    const iconos = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const colores = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: white;
        border-radius: 16px;
        padding: 16px 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        border-left: 4px solid ${colores[tipo] || colores.info};
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        max-width: 380px;
        z-index: 9999;
        animation: toastEntrar 0.4s ease;
        font-family: 'Poppins', sans-serif;
    `;

    toast.innerHTML = `
        <span style="font-size:1.4rem;flex-shrink:0">${iconos[tipo] || iconos.info}</span>
        <div style="flex:1">
            <p style="font-size:0.88rem;font-weight:700;color:#03045E;margin-bottom:3px">${titulo}</p>
            <p style="font-size:0.78rem;color:#6c757d;line-height:1.5">${mensaje}</p>
        </div>
        <button onclick="this.parentElement.remove()" 
            style="background:none;border:none;cursor:pointer;color:#94A3B8;font-size:1rem;padding:4px;border-radius:50%;transition:0.2s"
            onmouseover="this.style.background='#F1F5F9'"
            onmouseout="this.style.background='none'">✕</button>
    `;

    // Agregar animación CSS
    if (!document.getElementById('toastStyles')) {
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.textContent = `
            @keyframes toastEntrar {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes toastSalir {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Eliminar toasts anteriores si hay más de 3
    const toasts = document.querySelectorAll('[data-toast]');
    if (toasts.length > 3) toasts[0].remove();

    toast.setAttribute('data-toast', 'true');

    // Auto-eliminar
    setTimeout(() => {
        toast.style.animation = 'toastSalir 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, CONFIG.duracionToast);
}

/* ===== BACK TO TOP ===== */
const backTop = document.getElementById('backTop');

function actualizarBackTop() {
    if (!backTop) return;
    if (window.scrollY > 400) {
        backTop.classList.add('visible');
    } else {
        backTop.classList.remove('visible');
    }
}

if (backTop) {
    backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ===== ANIMACIONES AL HACER SCROLL ===== */
function animarAlScroll() {
    const elementos = document.querySelectorAll(
        '.stat-item, .servicio-card, .beneficio-item, .opinion-card, .faq-item, .proceso-step, .contacto-card'
    );

    elementos.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && !el.classList.contains('animado')) {
            el.classList.add('animado');
            el.style.animation = 'aparecer 0.6s ease forwards';
        }
    });
}

// Agregar estilos de animación
const animStyle = document.createElement('style');
animStyle.textContent = `
    .stat-item,
    .servicio-card,
    .beneficio-item,
    .opinion-card,
    .faq-item,
    .proceso-step,
    .contacto-card {
        opacity: 0;
        transform: translateY(25px);
    }
    @keyframes aparecer {
        from { opacity: 0; transform: translateY(25px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animado {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animStyle);

window.addEventListener('scroll', animarAlScroll);
window.addEventListener('load', animarAlScroll);
animarAlScroll();

/* ===== WHATSAPP DINÁMICO ===== */
const waFloat = document.querySelector('.whatsapp-float');
if (waFloat) {
    const hora = new Date().getHours();
    let mensajeWa = '';

    if (hora >= 8 && hora < 19) {
        mensajeWa = '¡Hola! Me gustaría agendar una cita en Clínica La Villa Dental. ¿Tienen disponibilidad?';
    } else {
        mensajeWa = '¡Hola! Vi su página web y me gustaría información sobre sus servicios dentales.';
    }

    waFloat.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensajeWa)}`;
}

/* ===== TOAST DE BIENVENIDA ===== */
window.addEventListener('load', () => {
    setTimeout(() => {
        const hora = new Date().getHours();
        let saludo = '';

        if (hora >= 6 && hora < 12) saludo = '¡Buenos días!';
        else if (hora >= 12 && hora < 18) saludo = '¡Buenas tardes!';
        else saludo = '¡Buenas noches!';

        mostrarToast('info', saludo, '¿Necesitas una cita dental? ¡Estamos aquí para ayudarte! 🦷');
    }, 3000);
});

/* ===== RESIZE HANDLER ===== */
window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
        cerrarMenu();
    }
});

console.log('🦷 Clínica La Villa Dental - Sitio web cargado correctamente');
