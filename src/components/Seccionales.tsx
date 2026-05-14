import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Search, Navigation, Building2, ChevronRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const pinIcon = new L.DivIcon({
    className: '',
    html: `<div style="
        width:32px;height:32px;
        background:#1C75BB;
        border:3px solid #00AEEF;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 4px 12px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
});

// Fuerza recalculo de tiles al montar (fix carga incompleta)
const MapFix: React.FC = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 100);
    }, [map]);
    return null;
};

const SECCIONALES_DATA = [
    { nombre: "BAHIA BLANCA",              direccion: "ALMAFUERTE 517",                        telefono: "(0291) 452-9718 - 15 503-3892",        email: "sec_bahiablanca@apm.org.ar",   lat: -38.7183, lng: -62.2663 },
    { nombre: "BARILOCHE",                 direccion: "COMBATE DEL RINCON 1881, Piso PB",       telefono: "(0294) 432-7574",                      email: "sec_bariloche@apm.org.ar",     lat: -41.1335, lng: -71.3103 },
    { nombre: "CAPITAL FEDERAL",           direccion: "CÓRDOBA 2939",                           telefono: "(011) 4963-3231/7445",                 email: "sec_capital@apm.org.ar",       lat: -34.5992, lng: -58.3974 },
    { nombre: "CATAMARCA / LA RIOJA",      direccion: "CONGRESAL CENTENO 156",                  telefono: "(0383) 443-2433 - 383 496-2304",       email: "sec_catamarca@apm.org.ar",     lat: -28.4696, lng: -65.7852 },
    { nombre: "CENTRO BA (AZUL)",          direccion: "ARENALES 764",                           telefono: "(02281) 15 51-2952",                   email: "sec_azul@apm.org.ar",          lat: -36.7762, lng: -59.8578 },
    { nombre: "CENTRO BA (TANDIL)",        direccion: "SERRANO 1004",                           telefono: "(0249) 15 450-6415",                   email: "sec_tandil@apm.org.ar",        lat: -37.3217, lng: -59.1332 },
    { nombre: "CENTRO-NOROESTE",           direccion: "DR. REAL 963, Luján",                    telefono: "(011) 15 3667-1325",                   email: "sec_centronoroeste@apm.org.ar", lat: -34.5699, lng: -59.1073 },
    { nombre: "CHACO",                     direccion: "CERVANTES 134",                          telefono: "(0362) 15 437-4829",                   email: "sec_chaco@apm.org.ar",         lat: -27.4514, lng: -58.9868 },
    { nombre: "COMODORO RIVADAVIA",        direccion: "LA PRENSA 865",                          telefono: "(0297) 541-3853",                      email: "sec_crivadavia@apm.org.ar",    lat: -45.8649, lng: -67.4977 },
    { nombre: "CORRIENTES",                direccion: "F.J. CABRAL 2218",                       telefono: "(0379) 15 452-1301",                   email: "sec_corrientes@apm.org.ar",    lat: -27.4806, lng: -58.8341 },
    { nombre: "JUJUY",                     direccion: "PJE. ERNESTO CLAROS 33",                 telefono: "388 442-9835",                         email: "sec_jujuy@apm.org.ar",         lat: -24.1858, lng: -65.2995 },
    { nombre: "JUNIN",                     direccion: "RAMÓN FALCÓN 170",                       telefono: "(0236) 15 441-9543",                   email: "sec_junin@apm.org.ar",         lat: -34.5928, lng: -60.9468 },
    { nombre: "LA PAMPA",                  direccion: "ELISEO TELLO 450",                       telefono: "295 481-0359",                         email: "sec_lapampa@apm.org.ar",       lat: -36.6167, lng: -64.2833 },
    { nombre: "LA PLATA",                  direccion: "CALLE 38 640",                           telefono: "(0221) 421-6034 - (0221) 421-5265",   email: "sec_laplata@apm.org.ar",       lat: -34.9205, lng: -57.9536 },
    { nombre: "MAR DEL PLATA",             direccion: "25 DE MAYO 3334",                        telefono: "(0223) 15 686-0430",                   email: "sec_mardelplata@apm.org.ar",   lat: -38.0023, lng: -57.5575 },
    { nombre: "MENDOZA",                   direccion: "RIVADAVIA 76, Piso PB, Dpto: D",         telefono: "261 508-1295",                         email: "sec_mendoza@apm.org.ar",       lat: -32.8908, lng: -68.8272 },
    { nombre: "MISIONES",                  direccion: "AV. ROQUE SÁENZ PEÑA 2468",              telefono: "376 429-0947",                         email: "sec_misiones@apm.org.ar",      lat: -27.3671, lng: -55.8961 },
    { nombre: "NEUQUEN / R.NEGRO",         direccion: "PEHUÉN 868",                             telefono: "(0299) 442-8163 - 229 511-0148",       email: "sec_neuquen@apm.org.ar",       lat: -38.9516, lng: -68.0591 },
    { nombre: "NOROESTE",                  direccion: "RONDEAU 2236, Villa Lynch",              telefono: "(011) 7925-6724 - (011) 6654-6599",   email: "sec_noroeste@apm.org.ar",      lat: -34.5717, lng: -58.5483 },
    { nombre: "NORTE",                     direccion: "HILARIÓN DE LA QUINTANA 2899, Olivos",  telefono: "(011) 4790-9634 - 15 3667-6042",       email: "secretarianorte@apm.org.ar",   lat: -34.5067, lng: -58.4967 },
    { nombre: "OESTE",                     direccion: "YATAY 448, Morón",                       telefono: "(011) 2116-1477 - 15-3667-1228",       email: "sec_oeste@apm.org.ar",         lat: -34.6534, lng: -58.6198 },
    { nombre: "RIO CUARTO",                direccion: "SADI CARNOT 456",                        telefono: "(0358) 503-2864",                      email: "sec_riocuarto@apm.org.ar",     lat: -33.1307, lng: -64.3499 },
    { nombre: "SALTA",                     direccion: "ALVARADO 1262",                          telefono: "(0387) 422-1957",                      email: "sec_salta@apm.org.ar",         lat: -24.7859, lng: -65.4117 },
    { nombre: "SAN JUAN",                  direccion: "25 DE MAYO (OESTE) 178",                 telefono: "(0264) 15 586-6510",                   email: "sec_sanjuan@apm.org.ar",       lat: -31.5375, lng: -68.5364 },
    { nombre: "SAN LUIS",                  direccion: "BOLÍVAR 5700, San Luis",                 telefono: "(0266) 15 457-8270",                   email: "sec_sanluis@apm.org.ar",       lat: -33.2950, lng: -66.3356 },
    { nombre: "SANTA FE",                  direccion: "JUAN J. PASO 3462",                      telefono: "(0342) 459-8053",                      email: "sec_santafe@apm.org.ar",       lat: -31.6333, lng: -60.7000 },
    { nombre: "SEDE CENTRAL",              direccion: "AV. AVELLANEDA 2144",                    telefono: "(011) 4633-7878",                      email: "info@apm.org.ar",              lat: -34.6258, lng: -58.4641 },
    { nombre: "SGO. DEL ESTERO",           direccion: "24 DE SEPTIEMBRE 1394",                  telefono: "(0385) 425-3033",                      email: "sec_sgoestero@apm.org.ar",     lat: -27.7951, lng: -64.2615 },
    { nombre: "SUDOESTE",                  direccion: "PROF. MARIÑO 894, Temperley",            telefono: "Cel: 11-3667-8564",                    email: "sec_sudoeste@apm.org.ar",      lat: -34.7719, lng: -58.3972 },
    { nombre: "SUR",                       direccion: "GUIDO SPANO 629, Bernal",                telefono: "Cel. 15 3667-6377",                    email: "sec_sur@apm.org.ar",           lat: -34.7060, lng: -58.2800 },
    { nombre: "TRELEW",                    direccion: "CENTENARIO 394",                         telefono: "280 436-3164",                         email: "sec_trelew@apm.org.ar",        lat: -43.2489, lng: -65.3035 },
    { nombre: "TUCUMAN",                   direccion: "AV SÁENZ PEÑA 570",                      telefono: "(0381) 231-8502",                      email: "sec_tucuman@apm.org.ar",       lat: -26.8241, lng: -65.2226 },
];

export const Seccionales: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activePin, setActivePin] = useState<string | null>(null);

    const filteredSeccionales = SECCIONALES_DATA.filter(sec =>
        sec.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sec.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section id="seccionales" className="pt-32 pb-20 bg-white font-sans text-[#1C75BB] overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00AEEF]/10 rounded-full">
                            <Navigation size={16} className="text-[#00AEEF]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00AEEF]">Presencia Nacional</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            ¿Dónde nos <br /> <span className="text-[#00AEEF]">Encontramos?</span>
                        </h2>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#00AEEF] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar seccional o ciudad..."
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:border-[#00AEEF] focus:bg-white transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* MAPA CON PINS */}
                <div className="w-full h-[560px] rounded-2xl mb-20 overflow-hidden shadow-2xl border-4 border-white relative z-0">
                    <MapContainer
                        center={[-34.0, -64.0]}
                        zoom={4}
                        minZoom={4}
                        maxZoom={14}
                        maxBounds={[[-47, -75], [-20, -52]]}
                        maxBoundsViscosity={1.0}
                        style={{ width: '100%', height: '100%' }}
                        scrollWheelZoom={false}
                        attributionControl={false}
                    >
                        <MapFix />
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        {/* Islas Malvinas — tapa el texto del tile */}
                        <Marker
                            position={[-51.7, -59.0]}
                            zIndexOffset={1000}
                            icon={L.divIcon({
                                className: '',
                                html: `<div style="
                                    background:white;
                                    border:1.5px solid #1C75BB;
                                    border-radius:4px;
                                    padding:2px 7px;
                                    font-size:10px;
                                    font-weight:900;
                                    color:#1C75BB;
                                    white-space:nowrap;
                                    box-shadow:0 1px 4px rgba(0,0,0,0.15);
                                    font-family:sans-serif;
                                    letter-spacing:0.05em;
                                ">ISLAS MALVINAS</div>`,
                                iconSize: [116, 20],
                                iconAnchor: [58, 10],
                            })}
                        />

                        {SECCIONALES_DATA.map((sec) => (
                            <Marker
                                key={sec.nombre}
                                position={[sec.lat, sec.lng]}
                                icon={pinIcon}
                                eventHandlers={{ click: () => setActivePin(sec.nombre) }}
                            >
                                <Popup>
                                    <div style={{ fontFamily: 'sans-serif', minWidth: 180 }}>
                                        <p style={{ fontWeight: 900, fontSize: 13, color: '#1C75BB', textTransform: 'uppercase', marginBottom: 6 }}>
                                            {sec.nombre}
                                        </p>
                                        <p style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>📍 {sec.direccion}</p>
                                        <p style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>📞 {sec.telefono}</p>
                                        <p style={{ fontSize: 11, color: '#00AEEF' }}>✉ {sec.email}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

<div className="absolute bottom-6 left-6 bg-[#1C75BB] text-white p-4 rounded-2xl shadow-xl hidden lg:block border border-white/20 z-[1000]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#00AEEF] mb-1">Mapa Interactivo</p>
                        <p className="text-xs font-bold opacity-80">{SECCIONALES_DATA.length} seccionales en todo el país</p>
                    </div>
                </div>

                {/* GRILLA DE SECCIONALES */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSeccionales.map((sec, idx) => (
                        <div key={idx} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-[#00AEEF]/30 transition-all relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00AEEF] opacity-0 group-hover:opacity-100 transition-all"></div>

                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-slate-50 rounded-xl text-gray-400 group-hover:bg-[#00AEEF]/10 group-hover:text-[#00AEEF] transition-colors">
                                        <Building2 size={24} />
                                    </div>
                                    <ChevronRight size={16} className="text-slate-200 group-hover:text-[#00AEEF] transition-colors" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2 leading-tight">
                                    {sec.nombre}
                                </h3>
                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="text-[#00AEEF] shrink-0 mt-1" />
                                        <p className="text-sm font-bold opacity-70 italic">{sec.direccion}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone size={18} className="text-[#00AEEF] shrink-0 mt-1" />
                                        <p className="text-sm font-black">{sec.telefono}</p>
                                    </div>
                                    {sec.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail size={18} className="text-[#00AEEF] shrink-0" />
                                            <p className="text-xs font-bold truncate">{sec.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sec.direccion + ', ' + sec.nombre + ', Argentina')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 w-full py-3 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl group-hover:bg-[#00AEEF] group-hover:text-white transition-all shadow-inner text-center block"
                            >
                                Ver en Mapa
                            </a>
                        </div>
                    ))}
                </div>

                {filteredSeccionales.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-xl font-bold opacity-30 uppercase tracking-widest">No se encontraron seccionales para tu búsqueda</p>
                    </div>
                )}
            </div>
        </section>
    );
};
