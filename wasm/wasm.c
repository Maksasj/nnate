#define LEMON_ASSERT assert
#define LEMONA_PRINT printf

#define LEMON_INLINE
#define LEMON_IMPLEMENTATION
#include "lemon.h"

#define PEACH_RAND_MAX 65535.0f
#define PEACH_SIZE_T int
#define PEACH_INLINE
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

float train(BlueBerryModel* model) {
    peach_float_t itmp[] = {
        0.0f, 0.0f,
        0.0f, 1.0f,
        1.0f, 0.0f,
        1.0f, 1.0f
    };

    peach_matrix_t* inputs = paech_new_matrix(4, 2);
    peach_matrix_fill_values(inputs, itmp);

    peach_float_t otmp[] = {
        0.0f,
        0.0f,
        0.0f,
        1.0f
    };

    peach_matrix_t* outputs = paech_new_matrix(4, 1);
    peach_matrix_fill_values(outputs, otmp);

    blueb_train_gradient_descent(model, inputs, outputs, 4, 1, 0.05f);
    float cost = blueb_mse_cost(model, inputs, outputs, 4); 

    peach_free_matrix(inputs);
    peach_free_matrix(outputs);

    return cost;  
}
