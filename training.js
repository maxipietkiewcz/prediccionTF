// Definir variables para el modelo
let model;
let training = false; // Iniciar como falso, ya que el entrenamiento no ha comenzado

// Función para entrenar el modelo
export async function trainModel() {
  // Cambiar el estado de entrenamiento a verdadero
  training = true;

  // Crear el modelo
  model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // Compilar el modelo
  model.compile({
    loss: "meanSquaredError",
    optimizer: "sgd",
  });

  // Crear datos de entrenamiento
  const xs = tf.tensor2d([-6, -5, -4, -3, -2, -1, 0, 1, 2], [9, 1]);
  const ys = tf.tensor2d([-6, -4, -2, 0, 2, 4, 6, 8, 10], [9, 1]);

  // Entrenar el modelo
  await model.fit(xs, ys, { epochs: 500 });

  // Indicar que el entrenamiento ha terminado
  training = false;
  // Actualizar el mensaje de entrenamiento completado en el DOM
  document.getElementById("training-progress").textContent =
    "Entrenamiento completado";
}

// Función para predecir Y dada una X
export async function predictY(xValue) {
  // Convertir X a tensor
  const xTensor = tf.tensor2d([xValue], [1, 1]);

  // Predecir Y
  const predictedY = await model.predict(xTensor);

  // Mostrar el resultado
  const result = `Para X = ${xValue}, Y = ${predictedY.dataSync()[0]}`;
  // Actualizar el resultado de predicción en el DOM
  document.getElementById("prediction-result").textContent = result;
}

// Llama a trainModel cuando se carga la página
document.addEventListener("DOMContentLoaded", async () => {
  // Agregar un controlador de eventos para el botón de entrenamiento
  const trainButton = document.getElementById("train-button");
  trainButton.addEventListener("click", async () => {
    // Entrenar el modelo al hacer clic en el botón
    await trainModel();
  });

  // Agregar un controlador de eventos para el botón de predicción
  const predictButton = document.getElementById("predict-button");
  predictButton.addEventListener("click", () => {
    // Solo permitir la predicción si el modelo ha sido entrenado
    if (!training) {
      // Obtiene el valor de X ingresado por el usuario
      const xValue = parseFloat(document.getElementById("x-value").value);

      // Llama a la función predictY para predecir Y
      predictY(xValue);
    }
  });
});
