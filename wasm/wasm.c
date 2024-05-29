#define LEMON_ASSERT assert
#define LEMONA_PRINT printf

#define LEMON_IMPLEMENTATION
#include "lemon.h"

#define PEACH_MALLOC lemon_malloc
#define PEACH_FREE lemon_free
#define PEACH_POWF powf
#define PEACH_ASSERT assert
#define PEACH_PRINT printf
#define PEACH_RAND rand

#define BLUEB_MALLOC lemon_malloc
#define BLUEB_FREE lemon_free
#define BLUEB_PRINTF printf

#define BLUEBERRY_IMPLEMENTATION
#include "blueberry.h"

static lemon_byte_t heap[65535];

BlueBerryModel* create_model() {
    lemon_init(heap, 65535);

    int arc[] = { 2, 2, 1 };
    BlueBerryModel* model = blueb_new_model(arc, 3);
    blueb_rand_model(model, -1.0f, 1.0f);

    return model;
}

float train(BlueBerryModel* model) {
    peach_matrix_t* inputs[] = {
        paech_new_matrix(1, 2),
        paech_new_matrix(1, 2),
        paech_new_matrix(1, 2),
        paech_new_matrix(1, 2),
    };

    peach_matrix_t* outputs[] = {
        paech_new_matrix(1, 1),
        paech_new_matrix(1, 1),
        paech_new_matrix(1, 1),
        paech_new_matrix(1, 1),
    };

    for(int i = 0; i < 4; ++i) {
        peach_matrix_fill(inputs[i], 0.0f);
        peach_matrix_fill(outputs[i], 0.0f);
    }

    // Setup inputs
    PEACH_MATRIX_AT(inputs[1], 0, 0) = 1.0f;
    PEACH_MATRIX_AT(inputs[2], 0, 1) = 1.0f;
    
    PEACH_MATRIX_AT(inputs[3], 0, 0) = 1.0f;
    PEACH_MATRIX_AT(inputs[3], 0, 1) = 1.0f;

    // Setup outputs
    PEACH_MATRIX_AT(outputs[3], 0, 0) = 1.0f;

    blueb_train_gradient_descent(model, inputs, outputs, 4, 1, 0.05f);
    float cost = blueb_mse_cost(model, inputs, outputs, 4); 

    for(int i = 0; i < 4; ++i) {
        peach_free_matrix(inputs[i]);
        peach_free_matrix(outputs[i]);
    }

    return cost;  
}
