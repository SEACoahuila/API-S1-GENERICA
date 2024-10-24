import mongoose, { Document, PaginateModel, Schema, mquery } from "mongoose";
import mongooseService from "../common/services/mongoose.service";
import { CustomError } from "../exceptions/customError";
import { IQuery } from "../schemas/yup.query";
import paginate from 'mongoose-paginate-v2';


let mongoose2 = mongooseService.getMongoose();

interface IDeclaracion extends Document {
    nombre: String;
}
const declaracionSchema: Schema = new mongoose2.Schema({
    nombre: String
});

declaracionSchema.set('toJSON', {
    virtuals: true
});

declaracionSchema.plugin(paginate);

interface DeclaracionModel<T extends Document> extends PaginateModel<T> { }

class Declaracion {
    private static model: DeclaracionModel<IDeclaracion> = mongoose.model<IDeclaracion, mongoose.PaginateModel<IDeclaracion>>('Declaracione', declaracionSchema);

    static queryString = (cadena: String) => {
        cadena = cadena
            .toLowerCase()
            .replace("ñ", "#")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/a/g, '[a,á,à,ä]')
            .replace(/e/g, '[e,é,ë]')
            .replace(/i/g, '[i,í,ï]')
            .replace(/o/g, '[o,ó,ö,ò]')
            .replace(/u/g, '[u,ü,ú,ù]')
            .replace(/#/g, "ñ");

        return { $regex: cadena, $options: 'i' };
    }

    static query = async (query: IQuery) => {
        console.log("query: ", query);

        const q = query.query || undefined;
        const s = query.sort || undefined;
        let nQuery = {};
        let nSort = {};
        let page = query.page || 1;
        let nPageSize = query.pageSize || 10;
        let pageSize = nPageSize < 1 ? 10 : nPageSize > 200 ? 200 : nPageSize;

        if (q?.id && q.id !== '') {
            nQuery = { _id: mongoose.isValidObjectId(q.id) ? q.id : null };
        }

        if (q?.nombres && q.nombres !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosGenerales.nombre']: this.queryString(q.nombres || '') }
        }

        if (q?.primerApellido && q.primerApellido !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosGenerales.primerApellido']: this.queryString(q.primerApellido || '') }
        }

        if (q?.segundoApellido && q.segundoApellido !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosGenerales.segundoApellido']: this.queryString(q.segundoApellido || '') }
        }

        if (q?.escolaridadNivel && q.escolaridadNivel !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosCurricularesDeclarante.escolaridad.nivel.clave']: this.queryString(q.escolaridadNivel || '') }
        }

        if (q?.datosEmpleoCargoComision?.nombreEntePublico && q.datosEmpleoCargoComision.nombreEntePublico !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.nombreEntePublico']: this.queryString(q.datosEmpleoCargoComision.nombreEntePublico) }
        }

        if (q?.datosEmpleoCargoComision?.entidadFederativa && q.datosEmpleoCargoComision.entidadFederativa !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.domicilioMexico.entidadFederativa.clave']: q.datosEmpleoCargoComision.entidadFederativa }
        }

        if (q?.datosEmpleoCargoComision?.municipioAlcaldia && q.datosEmpleoCargoComision.municipioAlcaldia !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.domicilioMexico.municipioAlcaldia.clave']: q.datosEmpleoCargoComision.municipioAlcaldia }
        }

        if (q?.datosEmpleoCargoComision?.empleoCargoComision && q.datosEmpleoCargoComision.empleoCargoComision !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.empleoCargoComision']: this.queryString(q.datosEmpleoCargoComision.empleoCargoComision) }
        }

        if (q?.datosEmpleoCargoComision?.nivelOrdenGobierno && q.datosEmpleoCargoComision.nivelOrdenGobierno !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.nivelOrdenGobierno']: this.queryString(q.datosEmpleoCargoComision.nivelOrdenGobierno) }
        }

        if (q?.datosEmpleoCargoComision?.nivelEmpleoCargoComision && q.datosEmpleoCargoComision.nivelEmpleoCargoComision !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.nivelEmpleoCargoComision']: this.queryString(q.datosEmpleoCargoComision.nivelEmpleoCargoComision) }
        }

        if (q?.bienesInmuebles?.superficieConstruccion && Object.keys(q.bienesInmuebles.superficieConstruccion).length > 0) {
            const { superficieConstruccion } = q.bienesInmuebles
            const { min, max } = superficieConstruccion;
            let nRange = {};
            console.log("min, max : ", min, max);

            if (Object.keys(superficieConstruccion).length === 1) {
                if (min && min !== 0) nRange = { $gte: min };
                if (typeof max !== 'undefined') nRange = { $lte: max };
            } else {
                nRange = { $gte: min, $lte: max };
                if (min === max) nRange = { $eq: min }
            }

            //results[*].declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble[*].superficieConstruccion.valor
            if (Object.keys(nRange).length > 0) nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.superficieConstruccion.valor']: nRange }
        }


        if (q?.bienesInmuebles?.superficieTerreno && Object.keys(q.bienesInmuebles.superficieTerreno).length > 0) {
            const { superficieTerreno } = q.bienesInmuebles
            const { min, max } = superficieTerreno;
            let nRange = {};
            console.log("min, max : ", min, max);

            if (Object.keys(superficieTerreno).length === 1) {
                if (min && min !== 0) nRange = { $gte: min };
                if (typeof max !== 'undefined') nRange = { $lte: max };
            } else {
                nRange = { $elemMatch: { $gte: min, $lte: max } };
                // nRange = { $gte: min, $lte: max };
                if (min === max) nRange = { $eq: min }
            }

            //results[*].declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble[*].superficieTerreno.valor
            if (Object.keys(nRange).length > 0) nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.superficieTerreno.valor']: nRange }
        }

        if (q?.bienesInmuebles?.valorAdquisicion && Object.keys(q.bienesInmuebles.valorAdquisicion).length > 0) {
            // const opr = 'declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.valorAdquisicion.valor';
            const { valorAdquisicion } = q.bienesInmuebles
            const { min, max } = valorAdquisicion;
            let nRange = {};
            console.log("min, max : ", min, max);

            if (Object.keys(valorAdquisicion).length === 1) {
                if (min && min !== 0) nRange = { $gte: min };
                if (typeof max !== 'undefined') nRange = { $lte: max };
            } else {
                // nRange = { $elemMatch: { $gte: min, $lte: max } };
                // nRange = { '$and': [{ $gte: min, $lte: max }] };
                nRange = { $gte: min, $lte: max };
                if (min === max) nRange = { $eq: min }
            }


            // if (Object.keys(valorAdquisicion).length === 1) {
            //     if (min && min !== 0) nRange = { [opr]: { $gte: min } };
            //     if (typeof max !== 'undefined') nRange = { [opr]: { $lte: max } };
            // } else {
            //     // nRange = { $elemMatch: { $gte: min, $lte: max } };
            //     // nRange = { '$and': [{ $gte: min, $lte: max }] };
            //     nRange = { $and: [{ [opr]: { $gte: min } }, { [opr]: { $lte: max } }] };
            //     if (min === max) nRange = { [opr]: { $eq: min } }
            // }

            //results[*].declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble[*].valorAdquisicion.valor
            if (Object.keys(nRange).length > 0) nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.valorAdquisicion.valor']: nRange }
            // if (Object.keys(nRange).length > 0) nQuery = { ...nQuery, ...nRange }
        }


        if (q?.totalIngresosNetos && Object.keys(q.totalIngresosNetos).length > 0) {
            const { totalIngresosNetos } = q;
            const { min, max } = totalIngresosNetos;
            let nRange = {};
            console.log("min, max : ", min, max);

            if (Object.keys(totalIngresosNetos).length === 1) {
                if (min && min !== 0) nRange = { $gte: min };
                if (typeof max !== 'undefined') nRange = { $lte: max };
            } else {
                nRange = { $elemMatch: { $gte: min, $lte: max } };
                // nRange = { $gte: min, $lte: max };
                if (min === max) nRange = { $eq: min }
            }


            //results[*].declaracion.situacionPatrimonial.ingresos.ingresoMensualNetoDeclarante.valor
            const ini = 'declaracion.situacionPatrimonial.ingresos.ingresoMensualNetoDeclarante.valor'
            const mod = 'declaracion.situacionPatrimonial.ingresos.ingresoAnualNetoDeclarante.valor'
            const con = 'declaracion.situacionPatrimonial.ingresos.ingresoConclusionNetoDeclarante.valor'
            if (Object.keys(nRange).length > 0) nQuery = { ...nQuery, $or: [{ [ini]: nRange }, { [mod]: nRange }, { [con]: nRange }] }
        }

        if (q?.bienesInmuebles?.formaAdquisicion && q.bienesInmuebles.formaAdquisicion !== '') {
            nQuery = { ...nQuery, ['declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.formaAdquisicion.clave']: this.queryString(q.bienesInmuebles.formaAdquisicion) }
        }

        if (s?.nombres) {
            const order = (s.nombres === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.datosGenerales.nombre']: order };
        }

        if (s?.primerApellido) {
            const order = (s.primerApellido === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.datosGenerales.primerApellido']: order };
        }

        if (s?.segundoApellido) {
            const order = (s.segundoApellido === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.datosGenerales.segundoApellido']: order };
        }

        if (s?.escolaridadNivel) {
            const order = (s.escolaridadNivel === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.datosCurricularesDeclarante.escolaridad.nivel.clave']: order };
        }


        if (s?.datosEmpleoCargoComision?.nombreEntePublico) {
            const order = (s.datosEmpleoCargoComision.nombreEntePublico === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.nombreEntePublico']: order };
        }

        if (s?.datosEmpleoCargoComision?.entidadFederativa) {
            const order = (s.datosEmpleoCargoComision.entidadFederativa === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.domicilioMexico.entidadFederativa.clave']: order };
        }

        if (s?.datosEmpleoCargoComision?.municipioAlcaldia) {
            const order = (s.datosEmpleoCargoComision.municipioAlcaldia === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.domicilioMexico.municipioAlcaldia.clave']: order };
        }


        if (s?.datosEmpleoCargoComision?.empleoCargoComision) {
            const order = (s.datosEmpleoCargoComision.empleoCargoComision === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.empleoCargoComision']: order };
        }

        if (s?.datosEmpleoCargoComision?.nivelEmpleoCargoComision) {
            const order = (s.datosEmpleoCargoComision.nivelEmpleoCargoComision === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.nivelEmpleoCargoComision']: order };
        }


        if (s?.datosEmpleoCargoComision?.nivelOrdenGobierno) {
            const order = (s.datosEmpleoCargoComision.nivelOrdenGobierno === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.datosEmpleoCargoComision.nivelOrdenGobierno']: order };
        }



        if (s?.totalIngresosNetos) {
            const order = (s.totalIngresosNetos === 'asc' ? 1 : -1);
            const ini = 'declaracion.situacionPatrimonial.ingresos.ingresoMensualNetoDeclarante.valor'
            const mod = 'declaracion.situacionPatrimonial.ingresos.ingresoAnualNetoDeclarante.valor'
            const con = 'declaracion.situacionPatrimonial.ingresos.ingresoConclusionNetoDeclarante.valor'

            nSort = { ...nSort, [ini]: order, [mod]: order, [con]: order };
        }

        if (s?.bienesInmuebles?.superficieConstruccion) {
            const order = (s.bienesInmuebles.superficieConstruccion === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.superficieConstruccion.valor']: order };
        }

        if (s?.bienesInmuebles?.superficieTerreno) {
            const order = (s.bienesInmuebles.superficieTerreno === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.superficieTerreno.valor']: order };
        }

        if (s?.bienesInmuebles?.formaAdquisicion) {
            const order = (s.bienesInmuebles.formaAdquisicion === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.formaAdquisicion.clave']: order };
        }

        if (s?.bienesInmuebles?.valorAdquisicion) {
            const order = (s.bienesInmuebles.valorAdquisicion === 'asc' ? 1 : -1);
            nSort = { ...nSort, ['declaracion.situacionPatrimonial.bienesInmuebles.bienInmueble.valorAdquisicion.valor']: order };
        }

        console.log("nQuery: ", JSON.stringify(nQuery));
        console.log("nSort: ", JSON.stringify(nSort));

        try {
            let rQuery = await this.model.paginate(nQuery, { page, limit: pageSize, sort: nSort, collation: { locale: 'es' } }).then();

            return {
                pagination: { page: rQuery.page, pageSize: rQuery.limit, totalRows: rQuery.totalDocs, hasNextPage: rQuery.hasNextPage },
                results: rQuery.docs
            }

        } catch (error: object | any) {
            throw new CustomError('e_9002', 'Proceso de consulta fallido', error.message);
        }
    }
}

export default Declaracion;