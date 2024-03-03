/* Tabla de productos */
CREATE TABLE IF NOT EXISTS Products (
    id INTEGER PRIMARY KEY,
    price DECIMAL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
);

/* Tabla de estatus de la sesion */ 
CREATE TABLE IF NOT EXISTS Session_Status (
    id INTEGER PRIMARY KEY,
    description TEXT
);

-- Insertar estados de sesión
INSERT INTO Session_Status (id, description) VALUES (1, 'Editable');
INSERT INTO Session_Status (id, description) VALUES (2, 'Activa');
INSERT INTO Session_Status (id, description) VALUES (3, 'Cerrada');

/* Tabla de sesiones de venta */
CREATE TABLE IF NOT EXISTS Selling_Session (
    id INTEGER PRIMARY KEY,
    name TEXT,
    session_status_id INTEGER,
    created_at DATETIME,
    FOREIGN KEY (session_status_id) REFERENCES Session_Status(id)
);

/* Tabla de productos en sesion de venta */
CREATE TABLE IF NOT EXISTS Selling_Session_Products (
    id INTEGER PRIMARY KEY,
    selling_session_id INTEGER,
    product_type_id INTEGER,
    created_at DATETIME,
    FOREIGN KEY (selling_session_id) REFERENCES Selling_Session(id),
    FOREIGN KEY (product_type_id) REFERENCES Products(id)
);

/* Tabla de ventas */
CREATE TABLE IF NOT EXISTS Session_Product_Sales (
    id INTEGER PRIMARY KEY,
    selling_session_product_id INTEGER,
    product_name TEXT,
    sale_price DECIMAL,
    sale_date DATETIME,
    FOREIGN KEY (selling_session_product_id) REFERENCES Selling_Session_Products(id)
);


/* Tabla de tipos de eventos */
CREATE TABLE IF NOT EXISTS Event_Type (
    id INTEGER PRIMARY KEY,
    name TEXT
);

-- Insertar tipos de eventos
INSERT INTO Event_Type (id, name) VALUES (1, 'Sesión creada');
INSERT INTO Event_Type (id, name) VALUES (2, 'Sesión activada');
INSERT INTO Event_Type (id, name) VALUES (3, 'Sesión cerrada');
INSERT INTO Event_Type (id, name) VALUES (4, 'Producto vendido');


/* Tabla de eventos */
CREATE TABLE IF NOT EXISTS Events (
    id INTEGER PRIMARY KEY,
    event_type_id INTEGER,
    description TEXT,
    created_at DATETIME,
    FOREIGN KEY (event_type_id) REFERENCES Event_Type(id)
);
    
