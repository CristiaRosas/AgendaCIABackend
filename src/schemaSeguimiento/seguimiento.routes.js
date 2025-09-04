import { Router } from "express";
import {
    crearSeguimiento,
    obtenerSeguimientos,
    obtenerSeguimientoPorId,
    actualizarSeguimiento,
    eliminarSeguimiento,
    buscarPorEmpresa,
    buscarPorDedicacion,
    obtenerDedicaciones,
    obtenerTamanosEmpresa,
    obtenerComportamientosCompra,
    agregarVisita,
    actualizarVisita,
    eliminarVisita,
    obtenerVisitasPorEstado
} from "./seguimiento.controller.js";

const router = Router();

// Rutas existentes
router.post("/crear", crearSeguimiento);
router.get("/obtener", obtenerSeguimientos);
router.get("/obtener/:id", obtenerSeguimientoPorId);
router.put("/actualizar/:id", actualizarSeguimiento);
router.delete("/eliminar/:id", eliminarSeguimiento);
router.get("/buscar/empresa", buscarPorEmpresa);
router.get("/buscar/dedicacion", buscarPorDedicacion);

// Nuevas rutas para visitas
router.post("/:id/visitas", agregarVisita);
router.put("/:id/visitas/:visitaId", actualizarVisita);
router.delete("/:id/visitas/:visitaId", eliminarVisita);
router.get("/visitas/estado", obtenerVisitasPorEstado);

// Rutas para sugerencias
router.get("/dedicaciones", obtenerDedicaciones);
router.get("/tamanos-empresa", obtenerTamanosEmpresa);
router.get("/comportamientos-compra", obtenerComportamientosCompra);

export default router;