/* Tabla de productos */
DROP TABLE IF EXISTS Products;
CREATE TABLE IF NOT EXISTS Products (
    id INTEGER PRIMARY KEY,
    price NUMERIC,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Products (id, price, name) VALUES (1, 100, 'Naranjas');
INSERT INTO Products (id, price, name) VALUES (2, 200, 'Manzanas');

/* Tabla de estatus de la sesion */ 
DROP TABLE IF EXISTS Session_Status;
CREATE TABLE IF NOT EXISTS Session_Status (
    id INTEGER PRIMARY KEY,
    description TEXT
);

-- Insertar estados de sesión
INSERT INTO Session_Status (id, description) VALUES (1, 'Editable');
INSERT INTO Session_Status (id, description) VALUES (2, 'Activa');
INSERT INTO Session_Status (id, description) VALUES (3, 'Cerrada');

/* Tabla de sesiones de venta */
DROP TABLE IF EXISTS Selling_Session;
CREATE TABLE IF NOT EXISTS Selling_Session (
    id INTEGER PRIMARY KEY,
    name TEXT,
    session_status_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_status_id) REFERENCES Session_Status(id)
);

INSERT INTO Selling_Session (id, name, session_status_id) VALUES (1, 'Sesión 1', 1);

/* Tabla de productos en sesion de venta */
DROP TABLE IF EXISTS Selling_Session_Products;
CREATE TABLE IF NOT EXISTS Selling_Session_Products (
    id INTEGER PRIMARY KEY,
    selling_session_id INTEGER,
    product_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (selling_session_id) REFERENCES Selling_Session(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

/* INSERT INTO Selling_Session_Products (id, selling_session_id, product_id, quantity) VALUES (1, 1, 1, 10);
INSERT INTO Selling_Session_Products (id, selling_session_id, product_id, quantity) VALUES (2, 1, 2, 5);
 */
/* Tabla de ventas */
DROP TABLE IF EXISTS Session_Product_Sales;
CREATE TABLE IF NOT EXISTS Session_Product_Sales (
    id INTEGER PRIMARY KEY,
    selling_session_product_id INTEGER,
    product_name TEXT,
    sale_price NUMERIC,
    sale_date DATETIME,
    FOREIGN KEY (selling_session_product_id) REFERENCES Selling_Session_Products(id)
);


/* Tabla de tipos de eventos */
DROP TABLE IF EXISTS Event_Type;
CREATE TABLE IF NOT EXISTS Event_Type (
    id INTEGER PRIMARY KEY,
    name TEXT,
    color TEXT
);

-- Insertar tipos de eventos
INSERT INTO Event_Type (id, name, color) VALUES (1, 'Sesión creada', '#4CAF50');
INSERT INTO Event_Type (id, name, color) VALUES (2, 'Sesión activada', '#2196F3');
INSERT INTO Event_Type (id, name, color) VALUES (3, 'Sesión cerrada', '#D32F2F');
INSERT INTO Event_Type (id, name, color) VALUES (4, 'Producto vendido', '#ED733C');


/* Tabla de eventos */
DROP TABLE IF EXISTS Events;
CREATE TABLE IF NOT EXISTS Events (
    id INTEGER PRIMARY KEY,
    event_type_id INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_type_id) REFERENCES Event_Type(id)
);
    
/* Tabla de Configuracion Sheets */
DROP TABLE IF EXISTS Sheets_Config;
CREATE TABLE IF NOT EXISTS Sheets_Config (
    id INTEGER PRIMARY KEY,
    sheet_url TEXT
);

INSERT INTO Sheets_Config (id, sheet_url) VALUES (1, 'https://docs.google.com/spreadsheets/d/1J');