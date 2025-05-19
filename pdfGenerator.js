const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

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

            // Logo y encabezado
            doc.image(path.join(__dirname, '../assets/logo.png'), 50, 45, { width: 50 })
               .fillColor('#333333')
               .fontSize(20)
               .text('CARRERA CAPITAL', 110, 57)
               .fontSize(12)
               .text('Certificado de Residencia', 110, 80);
            
            doc.moveDown(2);
            
            // Cuerpo del certificado
            doc.fontSize(12)
               .text(`Certificado N°: CC-${certificado.id.toString().padStart(5, '0')}`, { align: 'right' })
               .moveDown(2)
               .text(`Por medio del presente se certifica que el/la Sr./Sra. ${certificado.nombre} ${certificado.apellido}`, { align: 'left' })
               .moveDown()
               .text(`reside en el departamento ${certificado.apartamento} del edificio Carrera Capital desde el ${new Date(certificado.fecha_ingreso).toLocaleDateString('es-ES')}.`, { align: 'left' })
               .moveDown(2)
               .text('Este certificado se expide a petición del interesado para los fines que estime convenientes.', { align: 'left' })
               .moveDown(4);
            
            // Firma
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