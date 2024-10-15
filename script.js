let matriz = [];
        
        function crearMatriz() {
            const numEcuaciones = parseInt(document.getElementById('numEcuaciones').value);
            const matrizDiv = document.getElementById('matrizInputs');
            matrizDiv.innerHTML = '';

            matriz = [];

            for (let i = 0; i < numEcuaciones; i++) {
                const fila = [];
                for (let j = 0; j < numEcuaciones + 1; j++) {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.id = `input-${i}-${j}`;
                    input.value = Math.floor(Math.random() * 10); // Valor por defecto aleatorio
                    fila.push(input);
                    matrizDiv.appendChild(input);
                }
                matrizDiv.appendChild(document.createElement('br'));
                matriz.push(fila);
            }
        }

        function obtenerMatriz() {
            return matriz.map(fila => fila.map(input => parseFloat(input.value)));
        }

        function mostrarMatriz(matriz) {
            const resultadosDiv = document.getElementById('resultados');
            resultadosDiv.textContent += matriz.map(fila => fila.map(val => val.toFixed(4)).join('\t')).join('\n') + '\n\n';
        }

        function gauss(matriz) {
            let n = matriz.length;
            for (let i = 0; i < n; i++) {
                let max = i;
                for (let j = i + 1; j < n; j++) {
                    if (Math.abs(matriz[j][i]) > Math.abs(matriz[max][i])) {
                        max = j;
                    }
                }
                [matriz[i], matriz[max]] = [matriz[max], matriz[i]];  // Intercambio de filas
                mostrarMatriz(matriz);

                for (let j = i + 1; j < n; j++) {
                    let factor = matriz[j][i] / matriz[i][i];
                    for (let k = i; k < n + 1; k++) {
                        matriz[j][k] -= factor * matriz[i][k];
                    }
                }
            }
            
            let soluciones = new Array(n);
            for (let i = n - 1; i >= 0; i--) {
                let suma = 0;
                for (let j = i + 1; j < n; j++) {
                    suma += matriz[i][j] * soluciones[j];
                }
                soluciones[i] = (matriz[i][n] - suma) / matriz[i][i];
            }
            return soluciones;
        }

        function gaussJordan(matriz) {
            let n = matriz.length;
            for (let i = 0; i < n; i++) {
                let divisor = matriz[i][i];
                for (let j = 0; j < n + 1; j++) {
                    matriz[i][j] /= divisor;
                }
                mostrarMatriz(matriz);

                for (let k = 0; k < n; k++) {
                    if (k !== i) {
                        let factor = matriz[k][i];
                        for (let j = 0; j < n + 1; j++) {
                            matriz[k][j] -= factor * matriz[i][j];
                        }
                    }
                }
                mostrarMatriz(matriz);
            }

            let soluciones = matriz.map(fila => fila[n]);
            return soluciones;
        }

        function gaussSeidel(matriz, tol = 1e-6, maxIter = 100) {
            let n = matriz.length;
            let soluciones = new Array(n).fill(0);
            let iteraciones = 0;
            
            while (iteraciones < maxIter) {
                let nuevasSoluciones = soluciones.slice();
                for (let i = 0; i < n; i++) {
                    let suma = matriz[i][n];
                    for (let j = 0; j < n; j++) {
                        if (j !== i) {
                            suma -= matriz[i][j] * nuevasSoluciones[j];
                        }
                    }
                    nuevasSoluciones[i] = suma / matriz[i][i];
                }
                
                let error = nuevasSoluciones.map((val, idx) => Math.abs(val - soluciones[idx])).reduce((a, b) => Math.max(a, b), 0);
                soluciones = nuevasSoluciones.slice();
                iteraciones++;

                const resultadosDiv = document.getElementById('resultados');
                resultadosDiv.textContent += `Iteración ${iteraciones}: ${soluciones.map(sol => sol.toFixed(4)).join(", ")}\n`;
                
                if (error < tol) break;
            }
            return soluciones;
        }

        function resolverSistema() {
            const matriz = obtenerMatriz();
            const metodo = document.getElementById('metodo').value;
            const resultadosDiv = document.getElementById('resultados');
            resultadosDiv.textContent = '';  // Limpiar resultados anteriores

            let soluciones;
            switch (metodo) {
                case "gauss":
                    soluciones = gauss(matriz);
                    break;
                case "gaussJordan":
                    soluciones = gaussJordan(matriz);
                    break;
                case "gaussSeidel":
                    soluciones = gaussSeidel(matriz);
                    break;
                default:
                    resultadosDiv.textContent = "Método no válido";
                    return;
            }

            resultadosDiv.textContent += "\nSoluciones:\n";
            soluciones.forEach((sol, idx) => {
                resultadosDiv.textContent += `x${idx + 1} = ${sol.toFixed(4)}\n`;
            });
        }