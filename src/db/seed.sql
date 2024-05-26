/* Tabla de productos */
DROP TABLE IF EXISTS Products;
CREATE TABLE IF NOT EXISTS Products (
    id INTEGER PRIMARY KEY,
    price NUMERIC,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* Tabla de estatus de la sesion */
DROP TABLE IF EXISTS Session_Status;
CREATE TABLE IF NOT EXISTS Session_Status (
    id INTEGER PRIMARY KEY,
    description TEXT
);


/* Tabla de sesiones de venta */
DROP TABLE IF EXISTS Selling_Session;
CREATE TABLE IF NOT EXISTS Selling_Session (
    id INTEGER PRIMARY KEY,
    name TEXT,
    session_status_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_status_id) REFERENCES Session_Status(id)
);



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

/* Tabla de ventas */
DROP TABLE IF EXISTS Session_Product_Sales;
CREATE TABLE IF NOT EXISTS Session_Product_Sales (
    id INTEGER PRIMARY KEY,
    selling_session_id INTEGER,
    selling_session_product_id INTEGER,
    product_name TEXT,
    sale_price NUMERIC,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (selling_session_id) REFERENCES Selling_Session(id),
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
INSERT INTO Event_Type (id, name, color) VALUES (2, 'Sesión cerrada', '#D32F2F');
INSERT INTO Event_Type (id, name, color) VALUES (3, 'Producto vendido', '#ED733C');


/* Tabla de eventos */
DROP TABLE IF EXISTS Events;
CREATE TABLE IF NOT EXISTS Events (
    id INTEGER PRIMARY KEY,
    event_type_id INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_type_id) REFERENCES Event_Type(id)
);

/* Tabla de Categorias */
DROP TABLE IF EXISTS Categories;
CREATE TABLE IF NOT EXISTS Categories (
    id INTEGER PRIMARY KEY,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* Tabla de Productos y Categorias */
DROP TABLE IF EXISTS Product_Categories;
CREATE TABLE IF NOT EXISTS Product_Categories (
    product_id INTEGER,
    category_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(id),
    FOREIGN KEY (category_id) REFERENCES Categories(id)
    PRIMARY KEY (product_id, category_id)
);



-- Triggers para insertar eventos

-- Trigger para insertar evento después de que se haya creado una sesión
DROP TRIGGER IF EXISTS insert_event_after_selling_session;
CREATE TRIGGER insert_event_after_selling_session
AFTER INSERT ON Selling_Session
BEGIN
    INSERT INTO Events (event_type_id, description, created_at)
    VALUES (1, 'Se ha creado una nueva sesión de venta "' || NEW.name || '".', datetime('now'));
END;

-- Trigger para insertar evento después de que se haya finalizado una sesión
DROP TRIGGER IF EXISTS update_event_after_selling_session;
CREATE TRIGGER update_event_after_selling_session
AFTER UPDATE OF session_status_id ON Selling_Session
WHEN NEW.session_status_id = 2 -- Asegúrate de que este valor coincide con el estado de sesión finalizada
BEGIN
    INSERT INTO Events (event_type_id, description, created_at)
    VALUES (2, 'Se ha finalizado la sesión de venta "' || NEW.name || '".', datetime('now'));
END;

-- Trigger para insertar evento después de que se haya vendido un producto
DROP TRIGGER IF EXISTS insert_event_after_product_sold;
CREATE TRIGGER insert_event_after_product_sold
AFTER INSERT ON Session_Product_Sales
BEGIN
   INSERT INTO Events (event_type_id, description, created_at)
    VALUES (3, 'Se ha vendido el producto "' || NEW.product_name || '". Precio: $'|| NEW.sale_price ||'.', datetime('now'));
END;

-- Insertar Categorias
INSERT INTO Categories (id, name) VALUES (1, 'Frutas');
INSERT INTO Categories (id, name) VALUES (2, 'Verduras');
INSERT INTO Categories (id, name) VALUES (3, 'Carnes');

-- Inserts de PRODUCTOS

-- Frutas 
INSERT INTO Products (id, price, name) VALUES (1, 100, 'Naranjas');
INSERT INTO Product_Categories (product_id, category_id) VALUES (1, 1);

INSERT INTO Products (id, price, name) VALUES (2, 200, 'Manzanas');
INSERT INTO Product_Categories (product_id, category_id) VALUES (2, 1);

INSERT INTO Products (id, price, name) VALUES (3, 100, 'Peras');
INSERT INTO Product_Categories (product_id, category_id) VALUES (3, 1);

INSERT INTO Products (id, price, name) VALUES (4, 200, 'Uvas');
INSERT INTO Product_Categories (product_id, category_id) VALUES (4, 1);

-- Verduras

INSERT INTO Products (id, price, name) VALUES (5, 100, 'Papas');
INSERT INTO Product_Categories (product_id, category_id) VALUES (5, 2);

INSERT INTO Products (id, price, name) VALUES (6, 200, 'Zanahorias');
INSERT INTO Product_Categories (product_id, category_id) VALUES (6, 2);

-- Carnes

INSERT INTO Products (id, price, name) VALUES (7, 100, 'Pollo');
INSERT INTO Product_Categories (product_id, category_id) VALUES (7, 3);

INSERT INTO Products (id, price, name) VALUES (8, 200, 'Res');
INSERT INTO Product_Categories (product_id, category_id) VALUES (8, 3);

INSERT INTO Products (id, price, name) VALUES (9, 100, 'Cerdo');
INSERT INTO Product_Categories (product_id, category_id) VALUES (9, 3);

INSERT INTO Products (id, price, name) VALUES (10, 200, 'Pescado');
INSERT INTO Product_Categories (product_id, category_id) VALUES (10, 3);


-- Inserts de STATUS DE SESION 
INSERT INTO Session_Status (id, description) VALUES (1, 'Activa');
INSERT INTO Session_Status (id, description) VALUES (2, 'Cerrada');

-- Inserts de SESIONES DE VENTA
INSERT INTO Selling_Session (id, name, session_status_id) VALUES (1, 'Sesión 1', 1);
INSERT INTO Selling_Session (id, name, session_status_id) VALUES (2, 'Demostración Ventas', 1);

-- Inserts de PRODUCTOS A SESION DE VENTA
INSERT INTO Selling_Session_Products (selling_session_id, product_id) VALUES (1, 1);
INSERT INTO Selling_Session_Products (selling_session_id, product_id) VALUES (1, 1);
INSERT INTO Selling_Session_Products (selling_session_id, product_id) VALUES (1, 1);
INSERT INTO Selling_Session_Products (selling_session_id, product_id) VALUES (1, 2);
INSERT INTO Selling_Session_Products (selling_session_id, product_id) VALUES (1, 2);


INSERT INTO Selling_Session_Products (selling_session_id, product_id) VALUES (2, 1);
INSERT INTO Selling_Session_Products (selling_session_id, product_id) VALUES (2, 2);
INSERT INTO Selling_Session_Products (selling_session_id, product_id) VALUES (2, 3);
INSERT INTO Selling_Session_Products (selling_session_id, product_id) VALUES (2, 4);
INSERT INTO Selling_Session_Products (selling_session_id, product_id) VALUES (2, 5);
INSERT INTO Selling_Session_Products (selling_session_id, product_id) VALUES (2, 6);

-- Inserts de VENTAS
INSERT INTO Session_Product_Sales (selling_session_id, selling_session_product_id, product_name, sale_price) VALUES (1, 1, 'Naranjas', 100);
INSERT INTO Session_Product_Sales (selling_session_id, selling_session_product_id, product_name, sale_price) VALUES (1, 2, 'Naranjas', 100);
INSERT INTO Session_Product_Sales (selling_session_id, selling_session_product_id, product_name, sale_price) VALUES (1, 4, 'Manzana', 200);