import { Schema, model } from 'mongoose';

// Schema para las visitas
const VisitaSchema = new Schema({
    fecha: {
        type: Date,
        required: [true, 'La fecha de la visita es requerida']
    },
    lugar: {
        type: String,
        required: [true, 'El lugar de la visita es requerido'],
        trim: true,
        minlength: [3, 'El lugar debe tener al menos 3 caracteres']
    },
    estadoVisita: {
        type: String,
        enum: {
            values: ['pendiente', 'agendada', 'completada', 'cancelada'],
            message: 'El estado de la visita debe ser: pendiente, agendada, completada o cancelada'
        },
        default: 'pendiente'
    },
    notas: {
        type: String,
        trim: true,
        maxlength: [500, 'Las notas no pueden exceder los 500 caracteres']
    }
}, {
    timestamps: true
});

// Schema principal del seguimiento
const SeguimientoSchema = Schema({
    nombreEmpresa: {
        type: String,
        required: [true, 'El nombre de la empresa es requerido'],
        minlength: [3, 'El nombre de la empresa debe tener al menos 3 caracteres'],
        trim: true
    },
    contacto: {
        type: String,
        required: [true, 'El contacto es requerido'],
        minlength: [5, 'El contacto debe tener al menos 5 caracteres'],
        trim: true
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es requerido'],
        match: [/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Por favor ingrese un número de teléfono válido'],
        trim: true
    },
    correo: {
        type: String,
        required: [true, 'El correo electrónico es requerido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un correo válido'],
        lowercase: true,
        trim: true
    },
    dedicacion: {
        type: String,
        required: [true, 'La dedicación de la empresa es requerida'],
        trim: true
    },
    sistemas: [{
        type: String,
        trim: true
    }],
    tamanoEmpresa: {
        type: String,
        required: [true, 'El tamaño de la empresa es requerido'],
        trim: true
    },
    desafios: [{
        type: String,
        trim: true
    }],
    puntosCriticos: [{
        type: String,
        trim: true
    }],
    objetivos: [{
        type: String,
        trim: true
    }],
    comportamientoCompra: {
        type: String,
        required: [true, 'El comportamiento de compra es requerido'],
        trim: true
    },
    // NUEVO: Campo de visitas
    visitas: [VisitaSchema],
    estado: {
        type: Boolean,
        default: true
    },
    prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta', 'urgente'],
    default: 'media'
  },
  fechaPrioridad: {
    type: Date,
    default: Date.now
  }
}, {
    timestamps: true,
    versionKey: false
});

// Índice para búsquedas eficientes de visitas
SeguimientoSchema.index({ 'visitas.fecha': 1 });
SeguimientoSchema.index({ 'visitas.estadoVisita': 1 });

export default model('Seguimiento', SeguimientoSchema);