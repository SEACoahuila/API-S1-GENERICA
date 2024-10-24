import { object, string, number, date, InferType } from 'yup';

export const querySchema = object({
    page: number().integer('solo acepta numeros enteros.').positive('solo acepta valores positivos.'),
    pageSize: number().integer(),
    sort: object({
        nombres: string().matches(/(asc|desc)/),
        primerApellido: string().matches(/(asc|desc)/),
        segundoApellido: string().matches(/(asc|desc)/),
        escolaridadNivel: string().matches(/(asc|desc)/),
        datosEmpleoCargoComision: object({
            nombreEntePublico: string().matches(/(asc|desc)/),
            entidadFederativa: string().matches(/(asc|desc)/),
            municipioAlcaldia: string().matches(/(asc|desc)/),
            empleoCargoComision: string().matches(/(asc|desc)/),
            nivelEmpleoCargoComision: string().matches(/(asc|desc)/),
            nivelOrdenGobierno: string().matches(/(asc|desc)/),
        }),
        totalIngresosNetos: string().matches(/(asc|desc)/),
        bienesInmuebles: object({
            superficieConstruccion: string().matches(/(asc|desc)/),
            superficieTerreno: string().matches(/(asc|desc)/),
            formaAdquisicion: string().matches(/(asc|desc)/),
            valorAdquisicion: string().matches(/(asc|desc)/),
        })
    }),
    query: object({
        id: string(),
        nombres: string(),
        primerApellido: string(),
        segundoApellido: string(),
        escolaridadNivel: string(),
        datosEmpleoCargoComision: object({
            nombreEntePublico: string(),
            entidadFederativa: string().max(2),
            municipioAlcaldia: string().max(3),
            empleoCargoComision: string(),
            nivelOrdenGobierno: string(),
            nivelEmpleoCargoComision: string(),
        }),
        bienesInmuebles: object({
            superficieConstruccion: object({
                min: number().integer(),
                max: number().integer(),
            }),
            superficieTerreno: object({
                min: number().integer(),
                max: number().integer(),
            }),
            formaAdquisicion: string(),
            valorAdquisicion: object({
                min: number().integer(),
                max: number().integer(),
            })
        }),
        totalIngresosNetos: object({
            min: number().integer(),
            max: number().integer(),
        })
    })
});


export type IQuery = InferType<typeof querySchema>;
