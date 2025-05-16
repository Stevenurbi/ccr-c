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

            // Encabezado
            doc.fontSize(20)
               .text('CARRERA CAPITAL', { align: 'center' })
               .fontSize(16)
               .text('Certificado de Residencia', { align: 'center' })
               .moveDown(2);
            
            // Número de certificado
            doc.fontSize(12)
               .text(`Certificado N°: CC-${certificado.id.toString().padStart(5, '0')}`, { align: 'right' })
               .moveDown(2);
            
            // Cuerpo del certificado
            doc.fontSize(12)
               .text(`Por medio del presente se certifica que el/la Sr./Sra. ${certificado.nombre} ${certificado.apellido}`, { align: 'left' })
               .moveDown()
               .text(`reside en el departamento ${certificado.apartamento} del edificio Carrera Capital desde el ${new Date(certificado.fecha_ingreso).toLocaleDateString('es-ES')}.`, { align: 'left' })
               .moveDown(2)
               .text('Este certificado se expide a petición del interesado para los fines que estime convenientes.', { align: 'left' })
               .moveDown(4);
            
            // Firma y fecha
            doc.text('_________________________', { align: 'right' })
               .text('Firma Autorizada', { align: 'right' })
               .moveDown()
               .text('Administración Carrera Capital', { align: 'right' })
               .moveDown()
               .text(new Date(certificado.fecha_solicitud).toLocaleDateString('es-ES'), { align: 'right' });
            
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generatePDF };