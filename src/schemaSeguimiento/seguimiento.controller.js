import { response } from "express";
import Seguimiento from "./seguimiento.model.js";

export const crearSeguimiento = async (req, res = response) => {
    const { nombreEmpresa, contacto, telefono, correo, dedicacion, sistemas, tamanoEmpresa, desafios, puntosCriticos, objetivos, comportamientoCompra, visitas } = req.body;

    try {
        // Validaciones básicas
        if (!nombreEmpresa || !contacto || !telefono || !correo || !dedicacion || !tamanoEmpresa || !comportamientoCompra) {
            return res.status(400).json({
                success: false,
                msg: "Todos los campos obligatorios deben ser completados"
            });
        }

        const seguimiento = await Seguimiento.create({
            nombreEmpresa,
            contacto,
            telefono,
            correo,
            dedicacion,
            sistemas: sistemas || [],
            tamanoEmpresa,
            desafios: desafios || [],
            puntosCriticos: puntosCriticos || [],
            objetivos: objetivos || [],
            comportamientoCompra,
            visitas: visitas || [] // ← Nuevo campo
        });

        res.status(200).json({
            success: true,
            msg: "Seguimiento creado correctamente",
            seguimiento
        });
    } catch (error) {
        console.error("Error creando seguimiento:", error);
        res.status(500).json({
            success: false,
            msg: "Error al crear seguimiento",
            error: error.message
        });
    }
}

export const obtenerSeguimientos = async (req, res = response) => {
    const { limite = 100, desde = 0 } = req.query;
    const query = { estado: true };

    try {
        const seguimientos = await Seguimiento.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .sort({ createdAt: -1 });

        const total = await Seguimiento.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            seguimientos
        });
    } catch (error) {
        console.error("Error obteniendo seguimientos:", error);
        res.status(500).json({
            success: false,
            msg: "Error al obtener seguimientos",
            error: error.message
        });
    }
}

export const obtenerSeguimientoPorId = async (req, res = response) => {
    const { id } = req.params;

    try {
        const seguimiento = await Seguimiento.findById(id);

        if (!seguimiento) {
            return res.status(404).json({
                success: false,
                msg: "Seguimiento no encontrado"
            });
        }

        if (!seguimiento.estado) {
            return res.status(400).json({
                success: false,
                msg: "El seguimiento no está activo"
            });
        }

        res.status(200).json({
            success: true,
            seguimiento
        });
    } catch (error) {
        console.error("Error obteniendo seguimiento:", error);
        res.status(500).json({
            success: false,
            msg: "Error al obtener seguimiento",
            error: error.message
        });
    }
}

export const actualizarSeguimiento = async (req, res = response) => {
    const { id } = req.params;
    const { ...data } = req.body;

    try {
        // Validar que existan campos para actualizar
        if (Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                msg: "Debe proporcionar al menos un campo para actualizar"
            });
        }

        const seguimiento = await Seguimiento.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        if (!seguimiento) {
            return res.status(404).json({
                success: false,
                msg: "Seguimiento no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Seguimiento actualizado correctamente",
            seguimiento
        });
    } catch (error) {
        console.error("Error actualizando seguimiento:", error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar seguimiento",
            error: error.message
        });
    }
}

export const eliminarSeguimiento = async (req, res = response) => {
    const { id } = req.params;
    const { confirm } = req.body;

    try {
        if (!confirm) {
            return res.status(400).json({
                success: false,
                msg: "Confirmación requerida"
            });
        }

        const seguimiento = await Seguimiento.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        );

        if (!seguimiento) {
            return res.status(404).json({
                success: false,
                msg: "Seguimiento no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Seguimiento eliminado correctamente"
        });
    } catch (error) {
        console.error("Error eliminando seguimiento:", error);
        res.status(500).json({
            success: false,
            msg: "Error al eliminar seguimiento",
            error: error.message
        });
    }
}

export const buscarPorEmpresa = async (req, res = response) => {
    const { nombre } = req.query;
    const { limite = 100, desde = 0 } = req.query;
    const query = { 
        estado: true,
        nombreEmpresa: { $regex: nombre, $options: "i" }
    };

    try {
        if (!nombre) {
            return res.status(400).json({
                success: false,
                msg: "El parámetro de búsqueda es requerido"
            });
        }

        const seguimientos = await Seguimiento.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .sort({ createdAt: -1 });

        const total = await Seguimiento.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            seguimientos
        });
    } catch (error) {
        console.error("Error buscando seguimientos por empresa:", error);
        res.status(500).json({
            success: false,
            msg: "Error al buscar seguimientos por empresa",
            error: error.message
        });
    }
}

export const buscarPorDedicacion = async (req, res = response) => {
    const { dedicacion } = req.query;
    const { limite = 100, desde = 0 } = req.query;
    const query = { 
        estado: true,
        dedicacion: { $regex: dedicacion, $options: "i" }
    };

    try {
        if (!dedicacion) {
            return res.status(400).json({
                success: false,
                msg: "El parámetro de dedicación es requerido"
            });
        }

        const seguimientos = await Seguimiento.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .sort({ createdAt: -1 });

        const total = await Seguimiento.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            seguimientos
        });
    } catch (error) {
        console.error("Error buscando seguimientos por dedicación:", error);
        res.status(500).json({
            success: false,
            msg: "Error al buscar seguimientos por dedicación",
            error: error.message
        });
    }
}

// Nuevo endpoint para obtener sugerencias de dedicaciones
export const obtenerDedicaciones = async (req, res = response) => {
    try {
        const dedicaciones = await Seguimiento.distinct("dedicacion", { estado: true });
        res.status(200).json({
            success: true,
            dedicaciones: dedicaciones.filter(d => d).sort()
        });
    } catch (error) {
        console.error("Error obteniendo dedicaciones:", error);
        res.status(500).json({
            success: false,
            msg: "Error al obtener dedicaciones",
            error: error.message
        });
    }
}

// Nuevo endpoint para obtener sugerencias de tamaños de empresa
export const obtenerTamanosEmpresa = async (req, res = response) => {
    try {
        const tamanos = await Seguimiento.distinct("tamanoEmpresa", { estado: true });
        res.status(200).json({
            success: true,
            tamanos: tamanos.filter(t => t).sort()
        });
    } catch (error) {
        console.error("Error obteniendo tamaños de empresa:", error);
        res.status(500).json({
            success: false,
            msg: "Error al obtener tamaños de empresa",
            error: error.message
        });
    }
}

// Nuevo endpoint para obtener sugerencias de comportamientos de compra
export const obtenerComportamientosCompra = async (req, res = response) => {
    try {
        const comportamientos = await Seguimiento.distinct("comportamientoCompra", { estado: true });
        res.status(200).json({
            success: true,
            comportamientos: comportamientos.filter(c => c).sort()
        });
    } catch (error) {
        console.error("Error obteniendo comportamientos de compra:", error);
        res.status(500).json({
            success: false,
            msg: "Error al obtener comportamientos de compra",
            error: error.message
        });
    }
}

// NUEVAS FUNCIONES PARA VISITAS
export const agregarVisita = async (req, res = response) => {
    const { id } = req.params;
    const { fecha, lugar, estadoVisita, notas } = req.body;

    try {
        if (!fecha || !lugar) {
            return res.status(400).json({
                success: false,
                msg: "Fecha y lugar son requeridos para la visita"
            });
        }

        const seguimiento = await Seguimiento.findByIdAndUpdate(
            id,
            {
                $push: {
                    visitas: {
                        fecha: new Date(fecha),
                        lugar,
                        estadoVisita: estadoVisita || 'pendiente',
                        notas: notas || ''
                    }
                }
            },
            { new: true, runValidators: true }
        );

        if (!seguimiento) {
            return res.status(404).json({
                success: false,
                msg: "Seguimiento no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Visita agregada correctamente",
            seguimiento
        });
    } catch (error) {
        console.error("Error agregando visita:", error);
        res.status(500).json({
            success: false,
            msg: "Error al agregar visita",
            error: error.message
        });
    }
}

export const actualizarVisita = async (req, res = response) => {
    const { id, visitaId } = req.params;
    const { fecha, lugar, estadoVisita, notas } = req.body;

    try {
        const updateData = {};
        if (fecha) updateData['visitas.$.fecha'] = new Date(fecha);
        if (lugar) updateData['visitas.$.lugar'] = lugar;
        if (estadoVisita) updateData['visitas.$.estadoVisita'] = estadoVisita;
        if (notas !== undefined) updateData['visitas.$.notas'] = notas;

        const seguimiento = await Seguimiento.findOneAndUpdate(
            { _id: id, 'visitas._id': visitaId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!seguimiento) {
            return res.status(404).json({
                success: false,
                msg: "Seguimiento o visita no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Visita actualizada correctamente",
            seguimiento
        });
    } catch (error) {
        console.error("Error actualizando visita:", error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar visita",
            error: error.message
        });
    }
}

export const eliminarVisita = async (req, res = response) => {
    const { id, visitaId } = req.params;

    try {
        const seguimiento = await Seguimiento.findByIdAndUpdate(
            id,
            {
                $pull: {
                    visitas: { _id: visitaId }
                }
            },
            { new: true }
        );

        if (!seguimiento) {
            return res.status(404).json({
                success: false,
                msg: "Seguimiento no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Visita eliminada correctamente",
            seguimiento
        });
    } catch (error) {
        console.error("Error eliminando visita:", error);
        res.status(500).json({
            success: false,
            msg: "Error al eliminar visita",
            error: error.message
        });
    }
}

export const obtenerVisitasPorEstado = async (req, res = response) => {
    const { estado } = req.query;

    try {
        const query = { 
            estado: true,
            'visitas.estadoVisita': estado 
        };

        const seguimientos = await Seguimiento.find(query)
            .select('nombreEmpresa contacto visitas')
            .sort({ 'visitas.fecha': 1 });

        const visitas = seguimientos.flatMap(seg => 
            seg.visitas
                .filter(visita => visita.estadoVisita === estado)
                .map(visita => ({
                    ...visita.toObject(),
                    empresa: seg.nombreEmpresa,
                    contacto: seg.contacto
                }))
        );

        res.status(200).json({
            success: true,
            total: visitas.length,
            visitas
        });
    } catch (error) {
        console.error("Error obteniendo visitas:", error);
        res.status(500).json({
            success: false,
            msg: "Error al obtener visitas",
            error: error.message
        });
    }
}