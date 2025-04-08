# ARYControlAccess

**Versión Final - Proyecto Integrador**  
**Almacén Inteligente para Gestión de Contratos con Tecnología RFID**

**ARYControlAccess** es una aplicación móvil enfocada en la **seguridad, control de accesos y gestión confidencial de documentos** mediante tecnología RFID y NFC. Diseñada para entornos empresariales, permite registrar, monitorear y administrar de manera segura usuarios, documentos y dispositivos RFID, todo desde una interfaz intuitiva y multilenguaje.

Construida con **React Native**, **Expo**, **TypeScript** y una API en **Node.js**, la aplicación garantiza la protección de información mediante autenticación robusta, control de roles y administración digital de expedientes.

---

## 🔐 Funcionalidades clave

- **Autenticación segura** con control de roles: Administrador, Empleado e Invitado.
- **Modo claro y oscuro** adaptable al sistema del usuario.
- **Lectura de tarjetas RFID** desde hardware (ESP32 + RC522).
- **Lectura nativa por NFC** desde dispositivos compatibles (Android).
- **Gestión digital de documentos PDF** con subida, almacenamiento y consulta segura.
- **Registro automático o manual de tarjetas RFID**.
- **Navegación dinámica** adaptada al tipo de usuario.
- **Interfaz en español e inglés**, con cambio de idioma.
- **Dashboard** con estadísticas de actividad, accesos y movimientos recientes.
- **Control de accesos y monitoreo en tiempo real.**
- **Perfil personalizado de usuario.** modo oscuro y claro

---

## 🛠️ Tecnologías utilizadas

### Frontend
- **React Native + Expo**
- **TypeScript**
- **NativeBase**
- **React Navigation** (Stack & Bottom Tabs)
- **Axios** (comunicación API)
- **Expo FileSystem** (gestión de archivos PDF)
- **Expo NFC** (lectura nativa NFC)
- **i18n-js** (soporte multilenguaje: español / inglés)
- **Context API** (manejo global del estado)
- **Modo claro/oscuro** (automático o manual)

### Backend
- **Node.js + Express**
- **Mysql**
- **Multer** (subida de archivos)
- **dotenv, cors, uuid** y otras utilidades

### Hardware
- **ESP32** con módulo **RFID RC522** para lectura remota
- **Dispositivo móvil con NFC** para lectura directa

---

## ⚙️ Instalación

### Frontend

```bash
git clone https://github.com/Yoval128/app-arycontrolaccess.git
cd app-arycontrolaccess
npm install
npx expo start
````

----

## 👨‍💻 Autor
**Yoval128**

Técnico en Programación | Estudiante TSU en Desarrollo de Software

GitHub: [Yoval128](https://github.com/Yoval128)
