const archiver = require('archiver');
const path = require('path');
const { Readable } = require('stream');

class ZipExporter {
  exportToZip(files, res, projectName) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${projectName}.zip`);

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', err => {
      throw err;
    });

    archive.pipe(res);

    files.forEach(file => {
      const stream = Readable.from([file.content]);
      archive.append(stream, { name: file.path });
    });

    archive.finalize();
  }
}

module.exports = ZipExporter;