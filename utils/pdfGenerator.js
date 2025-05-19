const PDFDocument = require('pdfkit');

const generatePDF = (certificado) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Utilidades para datos seguros
            const safe = (val) => (val !== undefined && val !== null) ? val : '';
            const padId = (id) => id ? id.toString().padStart(5, '0') : '-----';
            const fechaIngreso = certificado.fecha_ingreso ? new Date(certificado.fecha_ingreso) : null;
            const fechaSolicitud = certificado.fecha_solicitud ? new Date(certificado.fecha_solicitud) : new Date();

            // Encabezado
            doc
                .fontSize(22)
                .fillColor('#2c3e50')
                .text('CARRERA CAPITAL', { align: 'center', underline: true })
                .moveDown(0.5)
                .fontSize(16)
                .fillColor('#3498db')
                .text('Certificado de Residencia', { align: 'center' })
                .moveDown(2);

            // Número de certificado y fecha de emisión
            doc
                .fontSize(12)
                .fillColor('black')
                .text(`Certificado N°: CC-${padId(certificado.id)}`, { align: 'right' })
                .text(`Fecha de emisión: ${fechaSolicitud.toLocaleDateString('es-ES')}`, { align: 'right' })
                .moveDown(2);

            // Cuerpo del certificado
            doc
                .fontSize(12)
                .fillColor('black')
                .text(
                    `La administración del edificio Carrera Capital certifica que:`,
                    { align: 'left' }
                )
                .moveDown(1)
                .font('Helvetica-Bold')
                .text(
                    `${safe(certificado.nombre)} ${safe(certificado.apellido)}`,
                    { align: 'left' }
                )
                .font('Helvetica')
                .text(
                    `Identificación: ${safe(certificado.numero_documento)}`,
                    { align: 'left' }
                )
                .text(
                    `Correo electrónico: ${safe(certificado.email)}`,
                    { align: 'left' }
                )
                .text(
                    `Teléfono: ${safe(certificado.telefono)}`,
                    { align: 'left' }
                )
                .text(
                    `Departamento: ${safe(certificado.apartamento)}`,
                    { align: 'left' }
                )
                .text(
                    `Fecha de ingreso: ${fechaIngreso ? fechaIngreso.toLocaleDateString('es-ES') : '---'}`,
                    { align: 'left' }
                )
                .moveDown(1)
                .text(
                    `Reside actualmente en el edificio Carrera Capital y este certificado se expide a petición del interesado para los fines que estime convenientes.`,
                    { align: 'left' }
                )
                .moveDown(4);

            // Firma y pie
            doc
                .fontSize(12)
                .text('_________________________', 400)
                .text('Firma y Sello', 430)
                .moveDown()
                .fontSize(10)
                .fillColor('#888')
                .text('Administración Carrera Capital', { align: 'right' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generatePDF };